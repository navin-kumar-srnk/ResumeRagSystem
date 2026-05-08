import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div  className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
      <div className="glass-panel rounded-2xl p-2 shadow-2xl border border-outline-variant/20 glass-effect">
        <div className="flex items-end gap-2 bg-surface-container rounded-xl p-2 focus-within:ring-2 ring-primary/30 transition-all">
        
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className=" px-2 flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm md:text-base py-3 resize-none max-h-32 custom-scrollbar"
            placeholder="Ask about candidate repository..."
            rows={1}
            disabled={disabled}
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send size={20} fill="currentColor" />
          </button>
        </div>
      
      </div>
    </div>
  );
};
