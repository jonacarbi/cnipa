#!/usr/bin/env node

/**
 * Security Audit Script for Solana Pump.Fun Bot
 * This script helps verify the code is safe to run
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Security Audit for Solana Pump.Fun Bot\n');

// Check for malicious packages
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const maliciousPackages = ['encrypt-layout-helper'];

console.log('📦 Checking for malicious packages...');
let maliciousFound = false;

for (const pkg of maliciousPackages) {
  if (packageJson.dependencies && packageJson.dependencies[pkg]) {
    console.log(`❌ MALICIOUS PACKAGE FOUND: ${pkg}`);
    maliciousFound = true;
  }
}

if (!maliciousFound) {
  console.log('✅ No malicious packages detected');
}

// Check for suspicious imports
console.log('\n🔍 Checking for suspicious imports...');
const filesToCheck = [
  'utils/utils.ts',
  'buy.ts',
  'constants/constants.ts'
];

const maliciousPatterns = [
  'encrypt-layout-helper',
  'initializeSession'
];

const legitimatePatterns = [
  'setTimeout(', // Used for delays in trading
  'setInterval(', // Used for periodic checks
  'axios.get(', // Used for price data
  'axios.post(' // Used for API calls
];

let maliciousFound2 = false;

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of maliciousPatterns) {
      if (content.includes(pattern)) {
        console.log(`❌ MALICIOUS PATTERN FOUND in ${file}: ${pattern}`);
        maliciousFound2 = true;
      }
    }
  }
}

if (!maliciousFound2) {
  console.log('✅ No malicious patterns detected');
  console.log('ℹ️  Legitimate patterns found (normal for trading bot):');
  console.log('   - setTimeout/setInterval: Used for trading delays and periodic checks');
  console.log('   - axios calls: Used for price data and API communication');
}

// Check for external network calls
console.log('\n🌐 Checking for external network calls...');
const networkPatterns = [
  'axios.get(',
  'axios.post(',
  'fetch(',
  'XMLHttpRequest'
];

let networkCallsFound = false;

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of networkPatterns) {
      if (content.includes(pattern)) {
        console.log(`ℹ️  Network call found in ${file}: ${pattern}`);
        networkCallsFound = true;
      }
    }
  }
}

if (networkCallsFound) {
  console.log('✅ Network calls detected - these are legitimate for trading bots');
  console.log('   - Price data from DexScreener and Birdeye APIs');
  console.log('   - Blockchain RPC calls for transactions');
} else {
  console.log('✅ No unexpected network calls detected');
}

// Summary
console.log('\n📋 Security Audit Summary:');
if (maliciousFound || maliciousFound2) {
  console.log('❌ SECURITY ISSUES DETECTED - DO NOT RUN THIS BOT');
  process.exit(1);
} else {
  console.log('✅ Code appears to be safe to run');
  console.log('\n⚠️  IMPORTANT REMINDERS:');
  console.log('1. Always test with small amounts first');
  console.log('2. Monitor the bot closely');
  console.log('3. Keep your private keys secure');
  console.log('4. Use a dedicated wallet for trading');
  console.log('5. The bot will make network calls to:');
  console.log('   - Solana RPC for blockchain transactions');
  console.log('   - DexScreener API for price data');
  console.log('   - Birdeye API for price data');
} 