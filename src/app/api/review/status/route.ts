import { NextRequest, NextResponse } from 'next/server';
import DB from '@/lib/db';

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

    // Get the session from database
    const session = await DB.reviewSessions.getById(id);

    if (!session) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        status: session.status,
        progress: session.progress,
        result: session.result,
        error: session.error,
        updatedAt: session.updated_at
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

    // Update the session in the database
    const session = await DB.reviewSessions.update(id, {
      status,
      progress,
      result,
      error
    });

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        status: session.status,
        progress: session.progress,
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
