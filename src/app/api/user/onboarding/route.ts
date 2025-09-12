import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
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
    const { phoneNumber, preferredExams, academicLevel, goals } = body;

    console.log('Onboarding data:', { phoneNumber, preferredExams, academicLevel, goals });

    // Update or create user in our database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        phoneNumber,
        preferredExams,
        academicLevel,
        goals,
        onboardingComplete: true,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        phoneNumber,
        preferredExams,
        academicLevel,
        goals,
        onboardingComplete: true,
        role: 'STUDENT',
        credits: 10, // Give new users some free credits
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
