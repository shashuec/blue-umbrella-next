/**
 * Comprehensive API validation script for Blue Umbrella
 * 
 * This script tests all API endpoints with both test mode and real mode
 * depending on environment configuration.
 * 
 * Set IS_TESTING_MODE=true to run in test mode with mock implementations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m'
};

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000',
  testFile: path.join(__dirname, '../public', 'test-portfolio.pdf'),
  endpoints: {
    upload: '/api/review/upload',
    verifyPhone: '/api/review/verify-phone',
    confirmOtp: '/api/review/confirm-otp',
    process: '/api/review/process',
    status: '/api/review/status'
  },
  mockEndpoints: {
    upload: '/api/mock/upload',
    verifyPhone: '/api/mock/verify-phone',
    confirmOtp: '/api/mock/confirm-otp',
    process: '/api/mock/process',
    status: '/api/mock/status'
  },
  testPhone: '+1234567890',
  mockOtp: '1234'
};

// Utility function for HTTP requests
async function request(method, endpoint, data = null, isFormData = false) {
  const url = `${config.baseUrl}${endpoint}`;
  
  const options = {
    method: method,
    headers: {}
  };
  
  if (data) {
    if (isFormData) {
      // For FormData, don't set Content-Type as it sets the correct boundary
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      options.body = formData;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`${colors.red}Error making request to ${url}:${colors.reset}`, error);
    return { status: 500, data: { error: error.message } };
  }
}

// Create a test PDF if it doesn't exist
function ensureTestFile() {
  if (!fs.existsSync(config.testFile)) {
    console.log(`${colors.yellow}Creating test PDF file...${colors.reset}`);
    const testDir = path.dirname(config.testFile);
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create a minimal PDF file for testing
    const pdfContent = `%PDF-1.5
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R 
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length 173 >>
stream
BT
/F1 24 Tf
100 700 Td
(TEST PORTFOLIO DOCUMENT) Tj
/F1 12 Tf
0 -50 Td
(Fund 1: Equity Large Cap - Value: $150,000 - Return: 12%) Tj
0 -20 Td
(Fund 2: Debt - Value: $100,000 - Return: 8%) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000300 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
526
%%EOF`;
    
    fs.writeFileSync(config.testFile, pdfContent);
    console.log(`${colors.green}Test PDF created at:${colors.reset} ${config.testFile}`);
  }
}

// Main test runner
async function runTests() {
  const isTestMode = process.env.IS_TESTING_MODE === 'true';
  console.log(`${colors.cyan}Running API validation in ${isTestMode ? 'TEST' : 'REAL'} mode${colors.reset}`);
  
  // Ensure the test file exists
  ensureTestFile();
  
  // Select the appropriate API endpoints based on mode
  const api = isTestMode ? config.mockEndpoints : config.endpoints;
  
  try {
    console.log(`\n${colors.magenta}Step 1: File Upload Test${colors.reset}`);
    
    // In a real test, we'd use FormData with an actual file
    // For this simple script, we'll use a "mock" upload with a file path
    const testFile = fs.readFileSync(config.testFile);
    const fileBlob = new Blob([testFile]);
    const file = new File([fileBlob], 'test-portfolio.pdf', { type: 'application/pdf' });
    
    const uploadData = {
      file: file
    };
    
    const uploadResult = await request('POST', api.upload, uploadData, true);
    console.log(`${colors.blue}Upload response:${colors.reset}`, uploadResult.data);
    
    if (!uploadResult.data.uploadId) {
      throw new Error('Upload failed or uploadId not returned');
    }
    
    const uploadId = uploadResult.data.uploadId;
    console.log(`${colors.green}Upload successful, received uploadId: ${uploadId}${colors.reset}`);
    
    console.log(`\n${colors.magenta}Step 2: Phone Verification Test${colors.reset}`);
    const phoneData = {
      phoneNumber: config.testPhone,
      uploadId: uploadId
    };
    
    const phoneResult = await request('POST', api.verifyPhone, phoneData);
    console.log(`${colors.blue}Phone verification response:${colors.reset}`, phoneResult.data);
    
    console.log(`\n${colors.magenta}Step 3: OTP Confirmation Test${colors.reset}`);
    const otpData = {
      otp: config.mockOtp,
      phoneNumber: config.testPhone,
      uploadId: uploadId
    };
    
    const otpResult = await request('POST', api.confirmOtp, otpData);
    console.log(`${colors.blue}OTP confirmation response:${colors.reset}`, otpResult.data);
    
    console.log(`\n${colors.magenta}Step 4: Processing Test${colors.reset}`);
    const processData = {
      uploadId: uploadId
    };
    
    const processResult = await request('POST', api.process, processData);
    console.log(`${colors.blue}Processing response:${colors.reset}`, processResult.data);
    
    const analysisId = processResult.data.analysisId || uploadId;
    
    console.log(`\n${colors.magenta}Step 5: Status Check Test${colors.reset}`);
    // Wait a bit for processing
    console.log(`${colors.yellow}Waiting 2 seconds for processing...${colors.reset}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResult = await request('GET', `${api.status}?id=${analysisId}`);
    console.log(`${colors.blue}Status check response:${colors.reset}`, statusResult.data);
    
    console.log(`\n${colors.green}All tests completed successfully!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Test failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the tests
runTests();
