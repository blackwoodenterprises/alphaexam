"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Lock,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

interface ExamDetailClientProps {
  exam: {
    id: string;
    title: string;
    price: number;
    isFree: boolean;
  };
}

interface UserCredits {
  credits: number;
}

export function ExamDetailClient({ exam }: ExamDetailClientProps) {
  const { user, isLoaded } = useUser();
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserCredits();
    }
  }, [user]);

  const fetchUserCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data);
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const canLaunchExam = () => {
    if (!user) return false;
    if (exam.isFree) return true;
    return userCredits && userCredits.credits >= exam.price;
  };

  const renderActionButton = () => {
    // Not logged in
    if (!isLoaded) {
      return (
        <Button disabled className="w-full">
          Loading...
        </Button>
      );
    }

    if (!user) {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Sign up for free!</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Create an account and get 100 credits free to start taking exams.
            </p>
            <Link href="/sign-up">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Sign Up & Get 100 Credits Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    // Logged in user
    if (loading) {
      return (
        <Button disabled className="w-full">
          Loading credits...
        </Button>
      );
    }

    if (canLaunchExam()) {
      return (
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          Launch Exam
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      );
    }

    // Not enough credits
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-900">Insufficient Credits</h4>
          </div>
          <p className="text-sm text-red-700 mb-3">
            You need {exam.price} credits to take this exam. You currently have{" "}
            {userCredits?.credits || 0} credits.
          </p>
        </div>
        <Link href="/credits/purchase">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <CreditCard className="w-4 h-4 mr-2" />
            Purchase Credits
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {exam.isFree ? "Free Exam" : `${exam.price} Credits`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user && userCredits && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your Credits:</span>
              <span className="font-semibold text-gray-900">
                {userCredits.credits}
              </span>
            </div>
          </div>
        )}
        {renderActionButton()}
        
        {exam.isFree && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              🎉 This exam is completely free! No credits required.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}