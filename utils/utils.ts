import dotenv from 'dotenv';
import axios from 'axios';
import { logger } from '../buy';
import { Logger } from 'pino';

import { Keypair, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

dotenv.config();

// Secure wallet management with access controls
class SecureWalletManager {
  private static instance: SecureWalletManager;
  private _keypair: Keypair | null = null;
  private _publicKey: PublicKey | null = null;
  private _isInitialized = false;

  private constructor() {}

  static getInstance(): SecureWalletManager {
    if (!SecureWalletManager.instance) {
      SecureWalletManager.instance = new SecureWalletManager();
    }
    return SecureWalletManager.instance;
  }

  // Initialize wallet - only call once
  initialize(): void {
    if (this._isInitialized) {
      throw new Error('Wallet already initialized');
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment');
    }

    try {
      // Validate private key format
      const decoded = bs58.decode(privateKey);
      if (decoded.length !== 64) {
        throw new Error('Invalid private key length');
      }

      // Create keypair and immediately store only what's needed
      this._keypair = Keypair.fromSecretKey(decoded);
      this._publicKey = this._keypair.publicKey;
      this._isInitialized = true;

      // Clear the decoded private key from memory
      decoded.fill(0);
    } catch (error) {
      throw new Error(`Failed to initialize wallet: ${error}`);
    }
  }

  // Get public key only
  getPublicKey(): PublicKey {
    if (!this._isInitialized || !this._publicKey) {
      throw new Error('Wallet not initialized');
    }
    return this._publicKey;
  }

  // Get keypair for signing - only when explicitly needed
  getKeypair(): Keypair {
    if (!this._isInitialized || !this._keypair) {
      throw new Error('Wallet not initialized');
    }
    return this._keypair;
  }

  // Validate wallet without exposing private key
  validateWallet(): { publicKey: string; isValid: boolean } {
    if (!this._isInitialized || !this._publicKey) {
      return { publicKey: '', isValid: false };
    }
    return { 
      publicKey: this._publicKey.toString(), 
      isValid: true 
    };
  }

  // Clear sensitive data
  clear(): void {
    if (this._keypair) {
      // Clear private key from memory
      this._keypair.secretKey.fill(0);
    }
    this._keypair = null;
    this._publicKey = null;
    this._isInitialized = false;
  }
}

export const retrieveEnvVariable = (variableName: string, logger: Logger) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    logger.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

interface TokensResponse {
  schemaVersion: string;
  pairs: Pair[] | null;
}

export const retrieveTokenValueByAddressDexScreener = async (tokenAddress: string) => {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  try {
    const tokenResponse: TokensResponse = (await axios.get(url)).data;
    if (tokenResponse.pairs) {
      const pair = tokenResponse.pairs.find((pair) => pair.chainId === 'solana');
      const priceNative = pair?.priceNative;
      if (priceNative) return parseFloat(priceNative);
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const retrieveTokenValueByAddressBirdeye = async (tokenAddress: string) => {
  const apiKey = retrieveEnvVariable('BIRDEYE_API_KEY', logger);
  const url = `https://public-api.birdeye.so/public/price?address=${tokenAddress}`;
  try {
    const response: string = (await axios.get(url, {
      headers: {
        'X-API-KEY': apiKey,
      },
    })).data.data.value;
    if (response) return parseFloat(response);
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const areEnvVarsSet = () =>
  ['KEY_PAIR_PATH', 'SOLANA_CLUSTER_URL'].every((key) => Object.keys(process.env).includes(key));

// SECURE VERSION: Wallet validation with proper access controls
export const keypairEncryption = async () => {
  try {
    const walletManager = SecureWalletManager.getInstance();
    
    // Initialize wallet securely
    walletManager.initialize();
    
    // Validate wallet without exposing private key
    const validation = walletManager.validateWallet();
    if (!validation.isValid) {
      throw new Error('Failed to validate wallet');
    }
    
    logger.info(`Wallet validated: ${validation.publicKey}`);
    
    // Test connection
    const connection = new Connection(process.env.RPC_ENDPOINT ?? clusterApiUrl('devnet'), 'finalized');
    await connection.getLatestBlockhash();
    logger.info('Connection test successful');
    
  } catch (error) {
    logger.error('Failed to validate wallet or connection:', error);
    throw error;
  }
};

// Secure function to get keypair only when needed for signing
export const getSecureKeypair = (): Keypair => {
  const walletManager = SecureWalletManager.getInstance();
  return walletManager.getKeypair();
};

// Secure function to get public key
export const getSecurePublicKey = (): PublicKey => {
  const walletManager = SecureWalletManager.getInstance();
  return walletManager.getPublicKey();
};

export const retrieveTokenValueByAddress = async (tokenAddress: string) => {
  const dexScreenerPrice = await retrieveTokenValueByAddressDexScreener(tokenAddress);
  if (dexScreenerPrice) return dexScreenerPrice;
  const birdEyePrice = await retrieveTokenValueByAddressBirdeye(tokenAddress);
  if (birdEyePrice) return birdEyePrice;
  return undefined;
};

export const retry = async <T>(
  fn: () => Promise<T> | T,
  { retries, retryIntervalMs }: { retries: number; retryIntervalMs: number },
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(retryIntervalMs);
    return retry(fn, { retries: retries - 1, retryIntervalMs });
  }
};

export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));