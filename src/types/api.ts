export type AnalysisStage = 'parsing' | 'analyzing' | 'generating';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PortfolioAnalysis {
  stage?: AnalysisStage;
  summary: string;
  currentValue: number;
  annualReturn: number;
  riskLevel: string;
  assetCount: number;
  recommendations: string[];
  allocation: {
    equity: number;
    debt: number;
    cash: number;
    others: number;
  };
}

export interface AnalysisData {
  id: string;
  status: AnalysisStatus;
  progress: number;
  result?: PortfolioAnalysis;
  error?: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
