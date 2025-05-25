#!/bin/zsh
# Script to run Blue Umbrella with the new changes

# Function to display messages with color
function print_message() {
  local color=$1
  local message=$2
  echo "\033[${color}m${message}\033[0m"
}

# Display banner
print_message "36" "=================================="
print_message "36" "    BLUE UMBRELLA - READY TO GO   "
print_message "36" "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  print_message "31" "Error: .env.local file not found!"
  print_message "33" "Please create a .env.local file with your Supabase credentials."
  exit 1
fi

# Kill any running Next.js processes
print_message "33" "Stopping any running Next.js processes..."
pkill -f "node.*next" || true
sleep 2

# Clear terminal
clear

# Show key environment status
print_message "32" "ENVIRONMENT STATUS:"
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"

# Check for Supabase credentials
print_message "33" "Checking .env.local for credentials..."
if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local && grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
  print_message "32" "✓ Supabase credentials found"
else
  print_message "31" "✗ Missing Supabase credentials"
fi

print_message "33" "SUMMARY OF CHANGES:"
echo "1. Phone verification requirement removed"
echo "2. Azure OpenAI integration added (can be used with real credentials)"
echo "3. Mock AI implementation for testing"

print_message "32" "Ready to run with:"
echo "- Use real Supabase for storage"
echo "- Skip phone verification"  
echo "- Use mock AI for analysis (unless you've added Azure OpenAI credentials)"

print_message "33" "Starting application..."
print_message "36" "Access the app at http://localhost:3000"
NODE_OPTIONS="--no-warnings" DOTENV_CONFIG_PATH=.env.local DOTENV_CONFIG_DEBUG=true next dev
