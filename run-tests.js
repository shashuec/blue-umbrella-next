#!/usr/bin/env node

/**
 * Test script for Blue Umbrella Portfolio Analysis
 * This script uses mock implementations to test the full flow
 */

// Set testing mode environment variable
process.env.IS_TESTING_MODE = 'true';
process.env.NODE_ENV = 'test';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { promisify } = require('util');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_PDF_PATH = path.join(__dirname, 'test', 'sample-portfolio.pdf');
const TEST_PHONE = '+1234567890';
const TEST_OTP = '1234';

// Simple HTTP request function
async function makeRequest(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        ...headers,
        'Content-Type': body ? 'application/json' : undefined
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({
              statusCode: res.statusCode,
              data: data ? JSON.parse(data) : {}
            });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Create test directory and sample PDF
function createTestFiles() {
  console.log('📄 Setting up test files...');
  
  if (!fs.existsSync(path.dirname(TEST_PDF_PATH))) {
    fs.mkdirSync(path.dirname(TEST_PDF_PATH), { recursive: true });
  }
  
  if (!fs.existsSync(TEST_PDF_PATH)) {
    console.log('Creating sample PDF for testing...');
    
    const pdfContent = `%PDF-1.3
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 90 >>
stream
BT
/F1 12 Tf
100 700 Td
(Blue Umbrella Test Portfolio) Tj
100 650 Td
(Mutual Fund List:) Tj
100 630 Td
(Fund 1: HDFC Top 100 - Units: 500 - NAV: 450.25 - Value: 225,125) Tj
100 610 Td
(Fund 2: SBI Blue Chip - Units: 750 - NAV: 32.80 - Value: 24,600) Tj
100 590 Td
(Fund 3: Axis Long Term Equity - Units: 1200 - NAV: 40.50 - Value: 48,600) Tj
100 570 Td
(Total Portfolio Value: 298,325) Tj
100 550 Td
(Asset Allocation: Equity: 70%, Debt: 20%, Gold: 5%, Others: 5%) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000059 00000 n
0000000118 00000 n
0000000217 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
357
%%EOF`;
    
    fs.writeFileSync(TEST_PDF_PATH, pdfContent);
  }
  
  console.log('✅ Test files ready');
}

// Create mock .env file for testing
function createTestEnv() {
  console.log('🔧 Setting up test environment...');
  
  const envContent = `# Testing Environment Configuration
IS_TESTING_MODE=true
NODE_ENV=test

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mock-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-anon-key
SUPABASE_SERVICE_ROLE_KEY=mock-service-role-key

# Twilio Configuration (Not required for testing)
TWILIO_ACCOUNT_SID=test-account-sid
TWILIO_AUTH_TOKEN=test-auth-token
TWILIO_PHONE_NUMBER=+15555555555

# OpenAI Configuration (Optional - mock responses used if missing)
OPENAI_API_KEY=

# Rate limiting (high number for testing)
RATE_LIMIT_UPLOADS=100
`;

  fs.writeFileSync(path.join(__dirname, '.env.test.local'), envContent);
  console.log('✅ Test environment ready');
}

// Test the API endpoints
async function testApiEndpoints() {
  try {
    console.log('\n🧪 TESTING API ENDPOINTS');
    console.log('-----------------------');
    
    // Step 1: Test upload endpoint
    console.log('\n1️⃣ Testing Upload API...');
    const uploadResult = await makeRequest(
      `${BASE_URL}/api/mock/upload`,
      'POST',
      { fileName: 'sample-portfolio.pdf' }
    );
    console.log('✅ Upload API Response:', uploadResult.data);
    const { uploadId } = uploadResult.data;
    
    // Step 2: Test phone verification
    console.log('\n2️⃣ Testing Phone Verification API...');
    const phoneResult = await makeRequest(
      `${BASE_URL}/api/mock/verify-phone`,
      'POST',
      { phoneNumber: TEST_PHONE, uploadId }
    );
    console.log('✅ Phone Verification API Response:', phoneResult.data);
    
    // Step 3: Test OTP confirmation
    console.log('\n3️⃣ Testing OTP Confirmation API...');
    const otpResult = await makeRequest(
      `${BASE_URL}/api/mock/confirm-otp`,
      'POST',
      { otp: TEST_OTP, phoneNumber: TEST_PHONE, uploadId }
    );
    console.log('✅ OTP Confirmation API Response:', otpResult.data);
    
    // Step 4: Test processing
    console.log('\n4️⃣ Testing Process API...');
    const processResult = await makeRequest(
      `${BASE_URL}/api/mock/process`,
      'POST',
      { uploadId }
    );
    console.log('✅ Process API Response:', processResult.data);
    const { analysisId } = processResult.data;
    
    // Step 5: Test status check
    console.log('\n5️⃣ Testing Status API...');
    const statusResult = await makeRequest(
      `${BASE_URL}/api/mock/status?id=${analysisId}`
    );
    console.log('✅ Status API Response:', statusResult.data);
    
    console.log('\n🎉 All API tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Create test script for our app
async function createUITestScript() {
  console.log('\n📝 Creating UI test script...');
  
  const scriptContent = `// UI Test Script
import { test, expect } from 'playwright';

// Test the complete portfolio review flow
test('Portfolio review flow', async ({ page }) => {
  // Set test mode
  await page.addInitScript(() => {
    window.localStorage.setItem('TEST_MODE', 'true');
  });
  
  // Step 1: Visit the review page
  await page.goto('/review');
  await expect(page.locator('h2')).toContainText('AI-Powered Mutual Fund Portfolio Review');
  
  // Step 2: Upload a file
  await page.setInputFiles('input[type="file"]', '${TEST_PDF_PATH.replace(/\\/g, '/')}');
  await page.click('button[type="submit"]');
  
  // Step 3: Enter phone number
  await expect(page.locator('h3')).toContainText('Verify Your Phone Number');
  await page.fill('input[type="tel"]', '${TEST_PHONE}');
  await page.click('button[type="submit"]');
  
  // Step 4: Enter OTP
  await expect(page.locator('h3')).toContainText('Enter Verification Code');
  // Fill in all OTP input fields
  const otpDigits = '${TEST_OTP}'.split('');
  for (let i = 0; i < otpDigits.length; i++) {
    await page.fill(\`input[aria-label="Digit \${i+1}"]\`, otpDigits[i]);
  }
  await page.click('button[type="submit"]');
  
  // Step 5: Wait for processing
  await expect(page.locator('h3')).toContainText('Analyzing Your Portfolio');
  
  // Step 6: Check for results (this might need a longer timeout in real testing)
  await expect(page.locator('h3')).toContainText('Portfolio Analysis', { timeout: 15000 });
  
  // Verify results are displayed
  await expect(page.locator('text=Current Value')).toBeVisible();
  await expect(page.locator('text=Asset Allocation')).toBeVisible();
  await expect(page.locator('text=Recommendations')).toBeVisible();
});
`;

  fs.writeFileSync(path.join(__dirname, 'test', 'portfolio-review.spec.ts'), scriptContent);
  console.log('✅ UI test script created');
}

// Main function that runs all tests
async function runTests() {
  try {
    console.log('🚀 Starting Blue Umbrella Portfolio Analysis Tests');
    console.log('===============================================');
    
    // Setup
    createTestFiles();
    createTestEnv();
    await createUITestScript();
    
    // Test API endpoints
    // Uncomment this if your API mock endpoints are ready
    // await testApiEndpoints();
    
    console.log('\n📋 Test Summary:');
    console.log('✅ Test environment setup: DONE');
    console.log('✅ Test files created: DONE');
    console.log('✅ UI test script created: DONE');
    // console.log('✅ API endpoints tested: DONE');
    
    console.log('\n🧪 To run the full UI test:');
    console.log('1. Start the development server:');
    console.log('   NODE_ENV=test npm run dev');
    console.log('2. Run your E2E tests (if you have Playwright installed):');
    console.log('   npx playwright test test/portfolio-review.spec.ts');
    
    console.log('\n💡 Alternatively, you can manually test using the UI:');
    console.log('1. Start the development server in test mode:');
    console.log('   NODE_ENV=test npm run dev');
    console.log('2. Visit http://localhost:3000/review in your browser');
    console.log('3. Upload the test PDF at test/sample-portfolio.pdf');
    console.log('4. Enter any phone number');
    console.log(`5. Use the test OTP: ${TEST_OTP}`);
    
    console.log('\n🎉 Test setup completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
