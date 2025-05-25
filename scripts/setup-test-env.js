#!/usr/bin/env node
/**
 * Setup Test Environment for Blue Umbrella Application
 * 
 * This script sets up a testing environment for running
 * automated tests in CI/CD or local development
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
  cyan: '\x1b[36m'
};

// Configuration
const config = {
  envFile: path.join(process.cwd(), '.env.test'),
  mockTwilioEnabled: true,
  mockOpenAIEnabled: true,
  mockSupabaseEnabled: true,
  testPort: 3001
};

/**
 * Create a test environment file
 */
function createTestEnvFile() {
  console.log(`${colors.yellow}Creating test environment file at:${colors.reset} ${config.envFile}`);

  const envContent = `# Blue Umbrella Test Environment
# --------------------------------
# This file is auto-generated for testing purposes
# Do not edit manually

# Test Mode Flag - Enables mock implementations
IS_TESTING_MODE=true
NODE_ENV=test

# Supabase Configuration (Mock)
NEXT_PUBLIC_SUPABASE_URL=https://mock-supabase-url.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock_anon_key
SUPABASE_SERVICE_ROLE_KEY=mock_service_role_key

# Twilio Configuration (Mock)
TWILIO_ACCOUNT_SID=mock_twilio_sid
TWILIO_AUTH_TOKEN=mock_twilio_token
TWILIO_PHONE_NUMBER=+15551234567

# OpenAI Configuration (Mock)
OPENAI_API_KEY=mock_openai_key

# Rate limiting (for testing)
RATE_LIMIT_UPLOADS=10
TEST_PORT=${config.testPort}
`;

  fs.writeFileSync(config.envFile, envContent);
  console.log(`${colors.green}Test environment file created successfully${colors.reset}`);
}

/**
 * Verify dependencies are installed
 */
function verifyDependencies() {
  console.log(`${colors.yellow}Verifying dependencies...${colors.reset}`);
  
  try {
    // Check for package.json
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      throw new Error('package.json not found in current directory');
    }
    
    // Check for node_modules
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
      execSync('npm install', { stdio: 'inherit' });
    }
    
    // Check for the required libraries
    const requiredPackages = [
      '@supabase/supabase-js',
      'dotenv-safe',
      'pdf-parse',
      'twilio',
      'openai'
    ];
    
    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
      } catch (e) {
        console.log(`${colors.yellow}Installing ${pkg}...${colors.reset}`);
        execSync(`npm install ${pkg}`, { stdio: 'inherit' });
      }
    }
    
    console.log(`${colors.green}All dependencies verified${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Failed to verify dependencies:${colors.reset}`, error);
    process.exit(1);
  }
}

/**
 * Create test directory and sample files if needed
 */
function createTestFiles() {
  console.log(`${colors.yellow}Creating test files...${colors.reset}`);
  
  const publicDir = path.join(process.cwd(), 'public');
  const testPdfPath = path.join(publicDir, 'test-portfolio.pdf');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  if (!fs.existsSync(testPdfPath)) {
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
    
    fs.writeFileSync(testPdfPath, pdfContent);
    console.log(`${colors.green}Test PDF created at:${colors.reset} ${testPdfPath}`);
  }
  
  console.log(`${colors.green}Test files created successfully${colors.reset}`);
}

/**
 * Main setup function
 */
async function setupTestEnvironment() {
  console.log(`${colors.cyan}Setting up test environment for Blue Umbrella${colors.reset}`);
  
  try {
    // Create test environment file
    createTestEnvFile();
    
    // Verify dependencies
    verifyDependencies();
    
    // Create test files
    createTestFiles();
    
    console.log(`\n${colors.green}Test environment setup complete!${colors.reset}`);
    console.log(`\nTo run tests in test mode, use one of the following commands:`);
    console.log(`\n${colors.yellow}• Run with test environment:${colors.reset}`);
    console.log(`  ${colors.cyan}node -r dotenv/config scripts/validate-api.js dotenv_config_path=.env.test${colors.reset}`);
    console.log(`\n${colors.yellow}• Start the application in test mode:${colors.reset}`);
    console.log(`  ${colors.cyan}npm run dev -- --port ${config.testPort} --dotenv .env.test${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Setup failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the setup
setupTestEnvironment();
