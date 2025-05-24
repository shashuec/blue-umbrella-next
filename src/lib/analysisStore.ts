// src/lib/analysisStore.ts

export interface AnalysisStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: { stage?: string; insights?: {
    summary: string;
    currentValue: number;
    annualReturn: number;
    riskLevel: string;
    assetCount: number;
    recommendations: string[];
    allocation: {
      equity: number;
      debt: number;
      gold: number;
      others: number;
    };
  }};
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Temporary in-memory store
const analysisStore: Record<string, AnalysisStatus> = {};

export function updateAnalysisStatus(
  id: string,
  updates: Partial<Omit<AnalysisStatus, 'id' | 'createdAt' | 'updatedAt'>>
) {
  if (!analysisStore[id]) {
    analysisStore[id] = {
      id,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  analysisStore[id] = {
    ...analysisStore[id],
    ...updates,
    updatedAt: new Date(),
  };

  return analysisStore[id];
}

export { analysisStore };
