import os
import shutil
from fastapi import FastAPI, UploadFile, File
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,          
    allow_methods=["*"],             
    allow_headers=["*"],             
)


# Configuration
UPLOAD_DIR = "uploads"
CHROMA_PATH = "local_vector_db"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. Initialize Local Models
local_embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
local_llm = Ollama(model="llama3")

# Initialize DB connection
db = Chroma(persist_directory=CHROMA_PATH, embedding_function=local_embeddings)

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Save the PDF file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Simplified Parsing
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # Split text into chunks for better LLM context
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)

    # Add metadata so we know who the content belongs to
    for chunk in chunks:
        chunk.page_content = f"Candidate: {file.filename} | {chunk.page_content}"

    # 3. Add to Vector DB with unique IDs (prevents duplicates)
    ids = [f"{file.filename}_{i}" for i in range(len(chunks))]
    db.add_documents(documents=chunks, ids=ids)
    
    return {"message": f"Successfully indexed {file.filename}"}


@app.get("/ask")
async def ask_question(query: str):
    # 1. Define your custom prompt
    # The variables {context} and {question} are mandatory—LangChain fills them in.
    template = """
    You are an expert HR Technical Recruiter. Use the following pieces of retrieved resume context 
    to answer the user's question. 

    Guidelines:
    - Only answer based on the provided context.
    - If you don't know the answer, say "I couldn't find information regarding this in the uploaded resumes."
    - Always mention which 'Candidate' (filename) you are referring to.
    - Keep the response professional and structured with bullet points if necessary.

    Context: {context}

    Question: {question}

    Helpful Recruiter Answer:"""

    custom_prompt = PromptTemplate(
        template=template, 
        input_variables=["context", "question"]
    )

    # 2. Configure the retriever
    retriever = db.as_retriever(search_kwargs={"k": 3})
    
    # 3. Create the chain with the 'chain_type_kwargs' parameter to pass your prompt
    qa_chain = RetrievalQA.from_chain_type(
        llm=local_llm, 
        chain_type="stuff", 
        retriever=retriever,
        chain_type_kwargs={"prompt": custom_prompt} # This injects your template
    )
    
    # 4. Invoke the chain
    response = qa_chain.invoke(query)
    
    return {
        "query": query,
        "answer": response["result"]
    }

@app.get("/search")
async def search_db(query: str, k: int = 3):
    """
    Directly searches the vector database.
    Useful for quick lookups and debugging the retrieval quality.
    """
    # 1. Perform similarity search with scores
    # Scores: Lower is usually "closer" in Chroma/L2 distance, 
    # but LangChain normalizes these for us.
    results = db.similarity_search_with_relevance_scores(query, k=k)
    
    formatted_results = []
    for doc, score in results:
        formatted_results.append({
            "text": doc.page_content,
            "score": round(float(score), 4),
            "source": doc.metadata.get("source"),
            "page": doc.metadata.get("page")
        })
        
    return {
        "query": query,
        "results_found": len(formatted_results),
        "results": formatted_results
    }


@app.get("/stats")
async def get_stats():
    data = db.get(include=['metadatas'])
    unique_sources = list(set([m["source"] for m in data['metadatas'] if "source" in m]))
    return {
        "files_indexed": unique_sources,
        "total_chunks": len(data['ids'])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)