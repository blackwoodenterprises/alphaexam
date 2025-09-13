import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('=== USER ENSURE EXISTS API CALLED ===');
    
    // Get authentication
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
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (user) {
      console.log('User already exists:', user.id);
      // Update user info from Clerk if needed
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || user.email,
          firstName: clerkUser.firstName || user.firstName,
          lastName: clerkUser.lastName || user.lastName,
        }
      });
    } else {
      // Create new user in our database
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          role: 'STUDENT',
          credits: 10, // Give new users some free credits
          onboardingComplete: false
        }
      });
      console.log('User created successfully:', user.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User ensured to exist',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        onboardingComplete: user.onboardingComplete
      }
    });

  } catch (error) {
    console.error('User ensure exists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}