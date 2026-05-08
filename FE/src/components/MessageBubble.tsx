import React from 'react';
import { Brain, User, FileText } from 'lucide-react';
import { Message } from '../types';
import { AnalysisResultCard } from './AnalysisResultCard';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'items-start' : 'flex-row-reverse items-start'} gap-4 max-w-[90%] ${!isAI && 'ml-auto'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${isAI ? 'bg-surface-container-highest text-primary border border-outline-variant/20' : 'bg-primary-container text-on-primary-container'}`}>
        {isAI ? <Brain size={20} fill="currentColor" /> : <User size={20} fill="currentColor" />}
      </div>
      
      <div className="space-y-3 flex-1">
        {message.status === 'thinking' ? (
          <div className="bg-surface-container-highest/50 rounded-xl rounded-tl-sm px-6 py-4 flex items-center gap-3 w-fit">
            <div className="flex gap-1">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
            <span className="text-xs font-medium text-on-surface-variant tracking-wide">Synthesizing insights...</span>
          </div>
        ) : (
          <>
            {message.analysis ? (
              <AnalysisResultCard analysis={message.analysis} />
            ) : (
              <div className={`${isAI ? 'bg-surface-container-highest rounded-tl-sm' : 'bg-primary-container rounded-tr-sm'} rounded-xl px-6 py-4 text-on-surface leading-relaxed shadow-xl`}>
                <p className="font-body text-sm md:text-base">{message.content}</p>
              </div>
            )}
            
            {message.meta && (
              <div className="flex items-center gap-2 px-1">
                <FileText size={12} className={isAI ? 'text-on-surface-variant' : 'text-on-primary-container'} />
                <span className={`text-[10px] font-medium uppercase tracking-wider ${isAI ? 'text-on-surface-variant' : 'text-on-primary-container'}`}>
                  {message.meta}
                </span>
              </div>
            )}

            {message.analysis?.source && (
              <div className="flex items-center gap-2 px-1">
                <FileText size={12} className="text-primary" />
                <span className="text-[11px] font-semibold text-on-surface-variant italic">
                  Source: {message.analysis.source}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
