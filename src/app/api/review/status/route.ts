import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for analysis statuses
// In a production environment, this would be replaced with a database
interface AnalysisStatus {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    const analysis = analysisStore[id];

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        status: analysis.status,
        progress: analysis.progress,
        result: analysis.result,
        error: analysis.error,
      },
    });
  } catch (error) {
    console.error('Error retrieving analysis status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis status' },
      { status: 500 }
    );
  }
}

// For testing/demo purposes, this function allows setting a status
// In production, this would be part of a queue processing system
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, status, progress, result, error } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Create or update the analysis status
    if (!analysisStore[id]) {
      analysisStore[id] = {
        id,
        status: status || 'pending',
        progress: progress || 0,
        result,
        error,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      analysisStore[id] = {
        ...analysisStore[id],
        status: status || analysisStore[id].status,
        progress: progress !== undefined ? progress : analysisStore[id].progress,
        result: result || analysisStore[id].result,
        error: error || analysisStore[id].error,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        id,
        status: analysisStore[id].status,
        progress: analysisStore[id].progress,
      },
    });
  } catch (error) {
    console.error('Error updating analysis status:', error);
    return NextResponse.json(
      { error: 'Failed to update analysis status' },
      { status: 500 }
    );
  }
}

// Helper function to be exported and used by other API routes
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
