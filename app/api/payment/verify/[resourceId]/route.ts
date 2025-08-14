import { NextRequest, NextResponse } from 'next/server';

// This would typically connect to a database to check payment status
// For this example, we'll use a simple in-memory approach
const paymentRecords: Record<string, boolean> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  const resourceId = params.resourceId;
  
  // In a real implementation, you would check a database
  // to verify if the user has paid for this resource
  const hasPaid = paymentRecords[resourceId] === true;
  
  return NextResponse.json({
    success: true,
    paid: hasPaid,
    resourceId,
  });
}

// This endpoint would be called after a successful payment
export async function POST(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  const resourceId = params.resourceId;
  
  try {
    const body = await request.json();
    const { transactionHash, walletAddress } = body;
    
    // In a real implementation, you would:
    // 1. Verify the transaction on-chain
    // 2. Check that it's for the correct amount
    // 3. Store the payment record in a database
    
    // For this example, we'll just mark it as paid
    paymentRecords[resourceId] = true;
    
    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
      resourceId,
      transactionHash,
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record payment' },
      { status: 400 }
    );
  }
}

