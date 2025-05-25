#!/usr/bin/env node

// Enable development mode by default
process.env.NODE_ENV = 'development';

console.log('🧪 Starting test environment setup...');

// Fill in development test values in .env.local
const fs = require('fs');
const path = require('path');

const envContent = `# Development Test Configuration
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

# Testing flag
IS_TESTING_MODE=true
`;

try {
  fs.writeFileSync(path.join(process.cwd(), '.env.test.local'), envContent);
  console.log('✅ Created test environment configuration');
} catch (error) {
  console.error('❌ Failed to create test environment:', error.message);
}

console.log('🧪 Test environment setup complete!');
console.log('\nTo run tests:');
console.log('1. First start the dev server with test environment:');
console.log('   NODE_ENV=development npm run dev');
console.log('\n2. Then in another terminal, run the test script:');
console.log('   node test-portfolio.js');
