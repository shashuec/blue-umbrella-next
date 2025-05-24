import { NextRequest, NextResponse } from 'next/server';
import { updateAnalysisStatus } from '@/lib/analysisStore';

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

    // Use updateAnalysisStatus to ensure the analysis exists, but don't update anything
    const analysis = updateAnalysisStatus(id, {});

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

    // Use updateAnalysisStatus to create or update the analysis
    const updated = updateAnalysisStatus(id, { status, progress, result, error });

    return NextResponse.json({
      success: true,
      data: {
        id,
        status: updated.status,
        progress: updated.progress,
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
