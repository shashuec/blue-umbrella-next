/**
 * Mock Supabase and API implementations for testing
 */

// Flag to check if we're in mock mode
export const isMockMode = () => {
  if (typeof process !== 'undefined') {
    return process.env.IS_TESTING_MODE === 'true' || process.env.NODE_ENV === 'test';
  }
  return false;
};

// Mock OTP code for testing
export const MOCK_OTP = '1234';

/**
 * Mock implementations for testing
 */
export const mocks = {
  // Mock review session for testing
  mockSession: {
    id: 'test-session-id',
    upload_path: 'test/sample-portfolio.pdf',
    upload_url: 'https://mock-url.com/test-file.pdf',
    phone_number: null,
    phone_verified: false,
    status: 'pending',
    progress: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Mock phone verification
  verifyPhone: async (phoneNumber, sessionId) => {
    console.log(`🧪 MOCK: Sending OTP ${MOCK_OTP} to ${phoneNumber} for session ${sessionId}`);
    return {
      success: true,
      message: 'Mock OTP sent successfully'
    };
  },

  // Mock OTP confirmation
  confirmOTP: async (otp, phoneNumber, sessionId) => {
    if (otp === MOCK_OTP) {
      console.log(`🧪 MOCK: OTP confirmed for ${phoneNumber}`);
      return { success: true };
    }
    throw new Error('Invalid OTP');
  },

  // Mock portfolio processing
  processPortfolio: async (sessionId) => {
    console.log(`🧪 MOCK: Processing portfolio ${sessionId}`);
    
    // Return analysis immediately for testing
    const mockResult = {
      summary: "This is a mock portfolio analysis for testing.",
      currentValue: 298325,
      annualReturn: 12.5,
      riskLevel: "Moderate",
      assetCount: 3,
      recommendations: [
        "Consider increasing equity allocation for better returns",
        "Rebalance your debt portfolio",
        "Add more diversification to reduce risk"
      ],
      allocation: {
        equity: 70,
        debt: 20,
        gold: 5,
        others: 5
      }
    };

    return {
      success: true,
      analysisId: sessionId,
      message: 'Mock processing started',
      result: mockResult
    };
  },

  // Mock status check
  checkStatus: async (analysisId) => {
    console.log(`🧪 MOCK: Checking status for ${analysisId}`);
    
    return {
      success: true,
      data: {
        id: analysisId,
        status: 'completed',
        progress: 100,
        result: {
          summary: "This is a mock portfolio analysis for testing.",
          currentValue: 298325,
          annualReturn: 12.5,
          riskLevel: "Moderate",
          assetCount: 3,
          recommendations: [
            "Consider increasing equity allocation for better returns",
            "Rebalance your debt portfolio",
            "Add more diversification to reduce risk"
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
    };
  }
};
