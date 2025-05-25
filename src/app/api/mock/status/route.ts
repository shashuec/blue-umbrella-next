import { NextRequest, NextResponse } from 'next/server';

// Mock status API for testing
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
    
    console.log(`📊 MOCK API: Checking status for ${id}`);
    
    // Always return completed status with mock results for testing
    return NextResponse.json({
      success: true,
      data: {
        id,
        status: 'completed',
        progress: 100,
        result: {
          summary: "This is a mock portfolio analysis for testing. Your portfolio shows a balanced approach with moderate risk and good diversification across asset classes.",
          currentValue: 298325,
          annualReturn: 12.5,
          riskLevel: "Moderate",
          assetCount: 3,
          recommendations: [
            "Consider increasing equity allocation by 10% for better long-term growth",
            "Rebalance debt funds to reduce duration risk in current market",
            "Add international exposure (5-10%) to improve diversification",
            "Consolidate similar funds to reduce overlap and management fees"
          ],
          allocation: {
            equity: 70,
            debt: 20,
            gold: 5,
            others: 5
          }
        },
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error in mock status:', error);
    
    return NextResponse.json(
      { error: 'Mock status check failed' },
      { status: 500 }
    );
  }
}
