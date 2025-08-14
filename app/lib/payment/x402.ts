import axios from 'axios';
import { createX402Axios } from 'x402-axios';
import type { WalletClient } from 'wagmi';

// Create a base axios instance
const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
});

/**
 * Creates an x402-enabled axios instance with the provided wallet client
 * @param walletClient - The wallet client from wagmi's useWalletClient hook
 * @returns An axios instance with x402 payment capabilities
 */
export function createX402Client(walletClient: WalletClient | null | undefined) {
  if (!walletClient) {
    // Return regular axios instance if no wallet client is available
    return baseAxios;
  }
  
  // Create and return an x402-enabled axios instance
  return createX402Axios(baseAxios, walletClient);
}

/**
 * Handles a payment request to a protected endpoint
 * @param walletClient - The wallet client from wagmi's useWalletClient hook
 * @param endpoint - The API endpoint to request
 * @param method - The HTTP method to use (default: 'GET')
 * @param data - Optional data to send with the request (for POST, PUT, etc.)
 * @returns The response from the protected endpoint
 */
export async function makePayment(
  walletClient: WalletClient | null | undefined,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) {
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }
  
  const x402Client = createX402Client(walletClient);
  
  try {
    let response;
    
    switch (method) {
      case 'GET':
        response = await x402Client.get(endpoint);
        break;
      case 'POST':
        response = await x402Client.post(endpoint, data);
        break;
      case 'PUT':
        response = await x402Client.put(endpoint, data);
        break;
      case 'DELETE':
        response = await x402Client.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

/**
 * Verifies if a user has already paid for a specific resource
 * @param walletClient - The wallet client from wagmi's useWalletClient hook
 * @param resourceId - The ID of the resource to check payment for
 * @returns Boolean indicating if the user has paid
 */
export async function verifyPayment(
  walletClient: WalletClient | null | undefined,
  resourceId: string
) {
  if (!walletClient) {
    return false;
  }
  
  try {
    const x402Client = createX402Client(walletClient);
    const response = await x402Client.get(`/api/payment/verify/${resourceId}`);
    return response.data.paid === true;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

