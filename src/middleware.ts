import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const isPublicRoute = createRouteMatcher([
  '/',
  '/exams(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

const isRestrictedForOnboardedUsers = createRouteMatcher([
  '/sign-up(.*)',
  '/onboarding(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Check if user is trying to access routes they shouldn't after onboarding
  if (userId && isRestrictedForOnboardedUsers(req)) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { onboardingComplete: true }
      });
      
      // If user exists and has completed onboarding, redirect to profile
      if (user && user.onboardingComplete) {
        return NextResponse.redirect(new URL('/profile', req.url));
      }
    } catch (error) {
      console.error('Error checking user onboarding status:', error);
      // Continue with normal flow if database query fails
    }
  }
  
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes (including admin routes)
  auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
