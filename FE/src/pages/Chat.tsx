import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';


import { Brain } from 'lucide-react';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { queryAI } from '../service/genService';

 const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello. I have indexed the repository. How can I assist your talent analysis today?',
      timestamp: Date.now(),
      meta: 'Repository Initialized'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await queryAI({ query: text });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex-1 mt-16 flex flex-col items-center justify-center relative overflow-hidden bg-surface">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Brain size={400} strokeWidth={0.5} />
      </div>

      <div className="w-full max-w-4xl h-full flex flex-col px-4 md:px-8 py-6 relative z-10">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pb-48 pt-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <MessageBubble 
              message={{ 
                id: 'typing', 
                role: 'assistant', 
                content: '', 
                timestamp: Date.now(), 
                status: 'thinking' 
              }} 
            />
          )}
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />

      {/* Overlays */}
      <div className="fixed top-16 left-0 w-full h-16 bg-gradient-to-b from-surface to-transparent pointer-events-none z-20" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none z-20" />
    </main>
  );
};
export default Chat;