import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== ONBOARDING API CALLED ===');
    console.log('Request method:', request.method);
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    // Try to get authentication
    const { userId } = await auth();
    const clerkUser = await currentUser();
    
    console.log('Auth results:', {
      userId,
      clerkUserId: clerkUser?.id,
      clerkUserEmail: clerkUser?.emailAddresses[0]?.emailAddress
    });
    
    if (!userId || !clerkUser) {
      console.log('Authentication failed');
      return NextResponse.json({ 
        error: 'Authentication required',
        debug: {
          hasUserId: !!userId,
          hasClerkUser: !!clerkUser,
          userIdValue: userId,
          clerkUserIdValue: clerkUser?.id
        }
      }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber, dateOfBirth, preferredExams, academicLevel, goals } = body;

    console.log('Onboarding data:', { phoneNumber, dateOfBirth, preferredExams, academicLevel, goals });

    // Check if user exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!existingUser) {
      console.log('User not found in database, they should have been created on first sign-in');
      return NextResponse.json({ 
        error: 'User not found. Please sign out and sign in again.',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Update existing user with onboarding data
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        preferredExams,
        academicLevel,
        goals,
        onboardingComplete: true,
        firstName: clerkUser.firstName || existingUser.firstName,
        lastName: clerkUser.lastName || existingUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
      },
    });

    console.log('User upserted successfully:', user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits
      }
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
