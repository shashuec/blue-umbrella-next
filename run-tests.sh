#!/bin/bash
# Run tests for Blue Umbrella application

# Set colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Display banner
echo -e "${GREEN}=======================================${RESET}"
echo -e "${GREEN}=  Blue Umbrella Test Suite Runner    =${RESET}"
echo -e "${GREEN}=======================================${RESET}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run tests.${RESET}"
    exit 1
fi

# Set environment variables
export IS_TESTING_MODE=true
export NODE_ENV=test

# Ensure scripts are executable
echo -e "${YELLOW}Ensuring test scripts are executable...${RESET}"
chmod +x scripts/setup-test-env.js scripts/validate-api.js scripts/run-integration-tests.js

# Run integration tests
echo -e "${CYAN}Running integration tests...${RESET}"
node scripts/run-integration-tests.js

# Check if tests completed successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}\n✅ All tests completed successfully!${RESET}"
    exit 0
else
    echo -e "${RED}\n❌ Tests failed. Check the logs above for errors.${RESET}"
    exit 1
fi
