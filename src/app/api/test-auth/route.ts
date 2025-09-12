import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  console.log('=== TEST AUTH ENDPOINT ===');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  try {
    const { userId } = auth();
    const user = await currentUser();
    
    return NextResponse.json({
      success: true,
      auth: {
        userId,
        userFromCurrentUser: user?.id,
        userEmail: user?.emailAddresses[0]?.emailAddress,
        userName: `${user?.firstName} ${user?.lastName}`
      },
      headers: Object.fromEntries(request.headers.entries())
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      headers: Object.fromEntries(request.headers.entries())
    });
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Same logic for POST
}
