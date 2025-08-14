import { NextRequest, NextResponse } from 'next/server';
import { createPaymentMiddleware } from 'x402-axios';

// The wallet address where payments will be sent
const RECIPIENT_ADDRESS = '0xYourWalletAddressHere'; // Replace with your actual wallet address

// Create the payment middleware
const paymentMiddleware = createPaymentMiddleware(RECIPIENT_ADDRESS, {
  // Define payment amounts for different endpoints
  '/api/payment': '0.01', // 0.01 USDC
});

export async function GET(request: NextRequest) {
  try {
    // This will handle the payment flow
    const response = await paymentMiddleware(request);
    
    // If payment is successful, return the protected content
    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        data: {
          content: 'This is the protected content that requires payment',
        },
      });
    }
    
    // If payment is required, return the payment response
    return response;
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment processing error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle POST requests similarly
    const response = await paymentMiddleware(request);
    
    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        data: {
          content: 'This is the protected content that requires payment',
        },
      });
    }
    
    return response;
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment processing error' },
      { status: 500 }
    );
  }
}

