# 🔧 **FIX: SOL Token Account Issue**

## 🚨 **The Problem:**
Your wallet has **native SOL** but the bot needs **wrapped SOL (wSOL)** to trade.

## ✅ **Solution: Wrap Your SOL**

### **Step 1: Check Your Current Balance**
```bash
solana balance ECmRbvvv6pGJvyF8nGQaKMhW8mis9uuTVkyjJ54t3G5y --url mainnet-beta
```

### **Step 2: Wrap SOL to wSOL**
```bash
# Wrap 0.1 SOL to wSOL (keep some for fees)
spl-token wrap 0.1 --url mainnet-beta
```

### **Step 3: Verify wSOL Account Created**
```bash
# Check your token accounts
spl-token accounts --url mainnet-beta
```

## 🔄 **Alternative: Use USDC Instead**

If you prefer to use USDC instead of wSOL:

### **Step 1: Update .env File**
```env
# Change from WSOL to USDC
QUOTE_MINT=USDC
QUOTE_AMOUNT=1
```

### **Step 2: Get USDC**
- Buy USDC from an exchange
- Transfer to your wallet
- Or swap SOL for USDC on Jupiter/Raydium

## 📋 **Complete Setup Steps:**

### **Option 1: Use wSOL (Recommended)**
1. **Wrap SOL**: `spl-token wrap 0.1`
2. **Keep .env as WSOL**: `QUOTE_MINT=WSOL`
3. **Set amount**: `QUOTE_AMOUNT=0.01`

### **Option 2: Use USDC**
1. **Get USDC** in your wallet
2. **Change .env**: `QUOTE_MINT=USDC`
3. **Set amount**: `QUOTE_AMOUNT=1`

## 🛡️ **Safety Reminders:**
- ✅ Bot is now clean and safe
- ✅ Use small amounts to test
- ✅ Monitor transactions closely
- ✅ Keep private keys secure

## 🚀 **After Fixing:**
```bash
# Run the bot again
npm run buy
```

The bot should now start successfully and begin monitoring for new pools! 