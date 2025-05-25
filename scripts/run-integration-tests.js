#!/usr/bin/env node
/**
 * Run Integration Tests for Blue Umbrella Project
 * 
 * This script sets up the test environment and runs the API validation
 * tests to ensure all components work together properly.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// Configuration
const config = {
  testEnvFile: path.join(process.cwd(), '.env.test'),
  setupScript: path.join(process.cwd(), 'scripts', 'setup-test-env.js'),
  validationScript: path.join(process.cwd(), 'scripts', 'validate-api.js'),
  port: process.env.TEST_PORT || 3001,
  waitTime: 5000, // Time to wait for server to start (ms)
};

/**
 * Run a script and return a promise that resolves when it completes
 */
function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.yellow}Running:${colors.reset} ${scriptPath} ${args.join(' ')}`);
    
    const child = spawn('node', [scriptPath, ...args], { 
      stdio: 'inherit',
      env: { ...process.env, IS_TESTING_MODE: 'true' }
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Script exited with code ${code}`));
      } else {
        resolve();
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Start the development server in test mode
 */
function startDevServer() {
  console.log(`${colors.cyan}Starting development server in test mode on port ${config.port}...${colors.reset}`);
  
  // Define environment variables for the server
  const serverEnv = {
    ...process.env,
    NODE_ENV: 'test',
    IS_TESTING_MODE: 'true',
    PORT: config.port
  };
  
  // Load variables from .env.test
  if (fs.existsSync(config.testEnvFile)) {
    const envContent = fs.readFileSync(config.testEnvFile, 'utf8');
    const envLines = envContent.split('\n');
    
    for (const line of envLines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          serverEnv[key.trim()] = value.trim();
        }
      }
    }
  }
  
  // Start the Next.js dev server
  const server = spawn('npx', ['next', 'dev', '--port', config.port], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: serverEnv,
    detached: true
  });
  
  // Log server output with prefix
  server.stdout.on('data', (data) => {
    console.log(`${colors.magenta}[SERVER]:${colors.reset} ${data.toString().trim()}`);
  });
  
  server.stderr.on('data', (data) => {
    console.error(`${colors.red}[SERVER ERROR]:${colors.reset} ${data.toString().trim()}`);
  });
  
  return server;
}

/**
 * Wait for server to be ready
 */
async function waitForServer() {
  console.log(`${colors.yellow}Waiting for server to start (${config.waitTime}ms)...${colors.reset}`);
  return new Promise(resolve => setTimeout(resolve, config.waitTime));
}

/**
 * Run integration tests
 */
async function runIntegrationTests() {
  console.log(`${colors.green}=================================${colors.reset}`);
  console.log(`${colors.green}=  Blue Umbrella Integration Tests  =${colors.reset}`);
  console.log(`${colors.green}=================================${colors.reset}\n`);
  
  let server;
  
  try {
    // Step 1: Setup test environment
    console.log(`${colors.cyan}Step 1: Setting up test environment...${colors.reset}`);
    await runScript(config.setupScript);
    
    // Step 2: Start the development server
    console.log(`\n${colors.cyan}Step 2: Starting development server...${colors.reset}`);
    server = startDevServer();
    await waitForServer();
    
    // Step 3: Run validation tests
    console.log(`\n${colors.cyan}Step 3: Running API validation tests...${colors.reset}`);
    await runScript(config.validationScript);
    
    console.log(`\n${colors.green}All integration tests completed successfully!${colors.reset}`);
    
  } catch (error) {
    console.error(`\n${colors.red}Integration tests failed:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Cleanup: Stop the server
    if (server) {
      console.log(`\n${colors.yellow}Stopping development server...${colors.reset}`);
      if (process.platform === 'win32') {
        // Windows requires different approach to kill process group
        execSync(`taskkill /pid ${server.pid} /T /F`);
      } else {
        // On Unix systems, kill the process group
        process.kill(-server.pid, 'SIGKILL');
      }
    }
  }
}

// Run the tests
runIntegrationTests();
