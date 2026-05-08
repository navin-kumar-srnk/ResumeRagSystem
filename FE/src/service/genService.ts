import axiosIns from "@/api";

// Define the interface to keep your types strict
export interface AIResponse {
  answer: string;
  query?: string;
}

export async function queryAI({ query }: { query: string }): Promise<AIResponse> {
  const { data } = await axiosIns.get('/ask', { params: { query } });
  return data;

  
}


export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosIns.post('/upload', formData);
  return data;
};
 

export const getStats = async () => {
  // We use the 'api' instance we created earlier
  const { data } = await axiosIns.get('/stats');
  return data;
};