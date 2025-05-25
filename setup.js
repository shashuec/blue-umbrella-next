#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Required dependencies for the Supabase integration
const requiredDependencies = {
  '@supabase/supabase-js': 'latest',
  'dotenv-safe': 'latest',
  'pdf-parse': 'latest',
  'twilio': 'latest',
  'openai': 'latest'
};

console.log('🔍 Checking for required dependencies...');

// Read the package.json file
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// Check which dependencies are missing
const missingDependencies = {};
for (const [dep, version] of Object.entries(requiredDependencies)) {
  if (!dependencies[dep] && !devDependencies[dep]) {
    missingDependencies[dep] = version;
  }
}

// Install missing dependencies if any
if (Object.keys(missingDependencies).length > 0) {
  console.log('📦 Installing missing dependencies:');
  console.log(missingDependencies);
  
  const installCommand = `npm install ${Object.entries(missingDependencies)
    .map(([dep, version]) => `${dep}@${version}`)
    .join(' ')}`;
  
  try {
    console.log(`Running: ${installCommand}`);
    execSync(installCommand, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ All required dependencies are already installed.');
}

// Check for .env.local file
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local file not found. Creating from .env.example...');
  
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ Created .env.local. Please edit it to add your credentials.');
  } else {
    console.log('❌ .env.example not found. Please create .env.local manually.');
  }
}

console.log('🚀 Setup complete! You can now run the development server:');
console.log('npm run dev');
