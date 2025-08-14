"use client";

import { useState, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import axios from 'axios';
import { createX402Axios } from 'x402-axios';

interface PaymentComponentProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
}

export function PaymentComponent({ onPaymentSuccess, onPaymentError }: PaymentComponentProps) {
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Create x402-axios instance with the wallet client
  const x402Client = createX402Axios(axios.create(), walletClient);

  const handlePayment = async () => {
    if (!walletClient) {
      setError('Wallet not connected. Please connect your wallet first.');
      onPaymentError?.('Wallet not connected');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Make a request to the protected endpoint
      const response = await x402Client.get('/api/payment');
      
      console.log('Payment response:', response);
      
      setPaymentStatus('success');
      onPaymentSuccess?.();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment');
      setPaymentStatus('error');
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-surface rounded-lg shadow-card">
      <h2 className="text-lg font-bold mb-4">Make a Payment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {paymentStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Payment successful!
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading || !walletClient || paymentStatus === 'success'}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          loading || !walletClient
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : paymentStatus === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-primary text-white hover:bg-primary/90'
        } transition-colors`}
      >
        {loading ? 'Processing...' : paymentStatus === 'success' ? 'Paid ✓' : 'Pay with USDC'}
      </button>
      
      <p className="mt-2 text-sm text-text-secondary">
        {!walletClient 
          ? 'Please connect your wallet to make a payment' 
          : 'This will initiate a USDC payment on Base'}
      </p>
    </div>
  );
}

