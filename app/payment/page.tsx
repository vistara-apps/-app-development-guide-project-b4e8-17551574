"use client";

import { useState } from 'react';
import { PaymentComponent } from '../components/PaymentComponent';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    // Redirect to a success page or show success message
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
    setPaymentStatus('error');
    setErrorMessage(error.message || 'An error occurred during payment');
  };

  return (
    <div className="container mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h1>
      
      <div className="mb-6 p-4 bg-surface rounded-lg shadow-card">
        <div className="flex justify-between mb-4">
          <span className="text-text-secondary">Amount:</span>
          <span className="font-medium">0.01 USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Network:</span>
          <span className="font-medium">Base</span>
        </div>
      </div>
      
      <PaymentComponent 
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
      
      {paymentStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
          Payment successful! Redirecting...
        </div>
      )}
      
      {paymentStatus === 'error' && errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-primary hover:underline"
        >
          Cancel and return home
        </button>
      </div>
    </div>
  );
}

