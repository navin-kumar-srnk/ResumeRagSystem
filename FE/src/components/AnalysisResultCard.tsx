import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisResultCardProps {
  analysis: AnalysisResult;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ analysis }) => {
  return (
    <div className="bg-surface-container-highest rounded-xl rounded-tl-sm px-6 py-5 text-on-surface leading-relaxed shadow-xl relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      <h4 className="font-headline font-bold text-primary mb-2 text-sm uppercase tracking-widest">Analysis Result</h4>
      <p className="font-body text-sm md:text-base mb-4">{analysis.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {analysis.strengths.map((s, i) => (
          <div key={i} className="bg-surface-container p-3 rounded-lg border border-outline-variant/10">
            <div className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase">{s.title || 'STRENGTH'}</div>
            <div className="text-xs">{s.content}</div>
          </div>
        ))}
        {analysis.gaps.map((g, i) => (
          <div key={i} className="bg-surface-container p-3 rounded-lg border border-outline-variant/10">
            <div className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase">{g.title || 'GAP'}</div>
            <div className="text-xs">{g.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
