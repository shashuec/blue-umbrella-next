# Blue Umbrella - Expert Mutual Fund Advisory

A modern landing page and AI-powered portfolio analysis service for Blue Umbrella's mutual fund portfolio management. Built with Next.js, Supabase, and OpenAI.

![Blue Umbrella Logo](public/file.svg)

## Features

- Modern, responsive design
- Interactive FAQ section
- AI-powered portfolio analysis
- PDF portfolio upload
- Phone verification via SMS/OTP
- Secure storage with Supabase
- Detailed investment insights and recommendations

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Database & Storage)
- OpenAI API (GPT-4)
- Twilio SMS
- PDF parsing

## Getting Started

### Environment Setup

1. Copy `.env.example` to `.env.local` and fill in the required values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Rate limiting (requests per hour)
RATE_LIMIT_UPLOADS=5
```

2. Set up Supabase:
   - Create a new project in Supabase
   - Run the database schema from `supabase/schema.sql` in the SQL Editor
   - Create a storage bucket named `portfolio-uploads` with private ACL

3. Install dependencies and set up environment:

```bash
# Run setup script to install required dependencies & create .env.local
node setup.js

# Or install manually
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Architecture

The portfolio review process follows these steps:

1. **Upload**: User uploads a PDF portfolio statement
   - File is streamed to Supabase Storage
   - A review session is created in the database

2. **Phone Verification**:
   - Phone number is collected and an OTP is sent via Twilio
   - OTP is stored in the database with expiry

3. **OTP Confirmation**:
   - User enters OTP which is verified against the database
   - Session is marked as phone-verified if successful

4. **Processing**:
   - PDF is downloaded from Supabase Storage
   - Text is extracted using pdf-parse
   - OpenAI GPT-4 analyzes the portfolio content
   - Results are stored in the database

5. **Results**:
   - Analysis results are presented to the user
   - Includes current value, performance, allocation, and recommendations

## Database Schema

### Tables

- **review_sessions**: Main table for tracking portfolio reviews
  - `id`: UUID - primary key
  - `upload_path`: Path to file in Storage
  - `upload_url`: Signed URL for access
  - `phone_number`: Verified phone
  - `phone_verified`: Boolean status
  - `status`: pending/processing/completed/failed
  - `progress`: 0-100 percentage
  - `stage`: Current processing stage
  - `result`: JSONB with analysis results
  - `error`: Any error messages
  - `ip_address`: For rate limiting
  - `created_at`, `updated_at`: Timestamps

- **phone_otps**: OTP tracking
  - `id`: UUID - primary key
  - `phone_number`: User's phone
  - `session_id`: FK to review_sessions
  - `otp_code`: Verification code
  - `verified`: Boolean status
  - `created_at`, `expires_at`: Timestamps

### Security Features

- Rate limiting: 5 uploads per IP per hour
- Private storage bucket with signed URLs
- Phone verification required before processing
- Row Level Security on all tables
- Service role for backend operations only

## Testing Infrastructure

### Test Environment

The application includes a comprehensive testing framework that allows running the entire system without real credentials:

1. **Test Mode**: Set `IS_TESTING_MODE=true` to enable mock implementations:
   - Mock Supabase storage with local file handling
   - Mock phone verification with predefined OTP codes
   - Mock OpenAI with predefined analysis results

2. **Test Scripts**:
   ```bash
   # Set up the test environment (creates .env.test file)
   npm run test:setup

   # Run API validation tests
   npm run test:api

   # Run complete integration tests (setup + server start + validation)
   npm run test
   ```

3. **Test Files**:
   - `/scripts/setup-test-env.js`: Creates test environment with mock credentials
   - `/scripts/validate-api.js`: Tests all API endpoints with mock data
   - `/scripts/run-integration-tests.js`: Complete test orchestration
   - `/.github/workflows/test.yml`: CI/CD integration with GitHub Actions

### Mock Implementations

The codebase includes mock implementations for testing:

1. **Mock API Routes**:
   - Mirror real API routes but use test implementations
   - Located in `/app/api/mock/`

2. **Supabase Mocks**:
   - Mock storage for file upload/download
   - Mock database operations
   - Automatic fallback to mock data in test mode

3. **Testing with Mock Data**:
   - Predefined OTP code: `1234`
   - Sample PDF content
   - Sample analysis results

### Running Tests in CI/CD

The project includes GitHub Actions configuration for automated testing:

```yaml
# .github/workflows/test.yml
name: Blue Umbrella Testing

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
