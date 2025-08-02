# 🛡️ **SAFE BOT USAGE GUIDE**

## ✅ **Current Status: BOT IS CLEAN**

The malicious code has been completely removed. The bot is now safe to use with proper precautions.

## 🚨 **CRITICAL: USE NEW WALLET**

**DO NOT use your original wallet** - it may still be compromised.

## 📋 **Safe Setup Steps:**

### **Step 1: Create New Wallet**
```bash
# Generate new wallet
solana-keygen new --outfile bot-wallet.json

# Get wallet address
solana-keygen pubkey bot-wallet.json
```

### **Step 2: Fund New Wallet**
```bash
# Transfer small amount to test (0.1 SOL)
solana transfer <NEW_WALLET_ADDRESS> 0.1 --url mainnet-beta
```

### **Step 3: Setup Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit with new wallet details
nano .env
```

### **Step 4: Configure .env File**
```env
# Use your NEW wallet private key
PRIVATE_KEY=your_new_wallet_private_key_here

# RPC endpoints
RPC_ENDPOINT=https://your-rpc-endpoint
RPC_WEBSOCKET_ENDPOINT=wss://your-websocket-endpoint

# Trading parameters
QUOTE_MINT=WSOL
QUOTE_AMOUNT=0.01
TAKE_PROFIT=0.5
STOP_LOSS=-0.1

# Safety settings
AUTO_SELL=true
CHECK_IF_MINT_IS_RENOUNCED=true
USE_SNIPE_LIST=false
```

## 🔧 **Running the Bot Safely:**

### **Step 1: Test with Security Audit**
```bash
# Run security check
node security-audit.js
```

### **Step 2: Start with Small Amounts**
```bash
# Start the bot
npm run buy
```

### **Step 3: Monitor Closely**
- Watch transaction logs
- Check wallet balance regularly
- Monitor for unexpected activity

## 🛡️ **Safety Features Built-In:**

### ✅ **Secure Wallet Management**
- Private keys are protected
- Memory is cleared after use
- Access controls prevent misuse

### ✅ **Transaction Monitoring**
- All transactions are logged
- URLs provided for verification
- Error handling prevents losses

### ✅ **Safety Checks**
- Mint authority verification
- Pool size validation
- Snipe list filtering

## 📊 **Monitoring Your Bot:**

### **Check Wallet Balance**
```bash
solana balance <WALLET_ADDRESS> --url mainnet-beta
```

### **View Recent Transactions**
```bash
solana transaction-history <WALLET_ADDRESS> --url mainnet-beta
```

### **Monitor Logs**
The bot provides detailed logging:
- Transaction signatures
- Solscan URLs for verification
- Profit/loss tracking

## ⚠️ **Important Warnings:**

1. **Never use your main wallet** - always use a dedicated bot wallet
2. **Start with small amounts** - test with 0.01 SOL first
3. **Monitor closely** - check transactions regularly
4. **Keep private keys secure** - never share or expose them
5. **Use hardware wallet** - for maximum security

## 🚨 **Red Flags to Watch For:**

- Unexpected transactions
- Funds moving without approval
- Unknown token approvals
- Suspicious contract interactions

## 📞 **If Something Goes Wrong:**

1. **Stop the bot immediately**
2. **Check transaction history**
3. **Transfer remaining funds to safe wallet**
4. **Revoke any suspicious permissions**

## ✅ **Success Indicators:**

- Bot logs show legitimate trading
- Transactions match expected behavior
- Profits are being made
- No unexpected fund movements

---

**The bot is now safe to use with proper precautions. Always use a new wallet and start small!** 