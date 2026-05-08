export type MessageRole = 'user' | 'assistant';

export interface AnalysisSection {
  title: string;
  content: string;
}

export interface AnalysisResult {
  summary: string;
  strengths: AnalysisSection[];
  gaps: AnalysisSection[];
  source?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: 'thinking' | 'complete';
  analysis?: AnalysisResult;
  meta?: string;
}
