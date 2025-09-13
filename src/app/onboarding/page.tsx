"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Phone, Target, BookOpen } from "lucide-react";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    preferredExams: [] as string[],
    academicLevel: "",
    goals: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const examOptions = [
    {
      id: "olympiad",
      name: "Mathematical Olympiads",
      description: "IMO, RMO, INMO",
    },
    {
      id: "jee",
      name: "JEE Main & Advanced",
      description: "Engineering entrance",
    },
    { id: "neet", name: "NEET", description: "Medical entrance" },
    {
      id: "competitive",
      name: "Other Competitive Exams",
      description: "UPSC, SSC, Banking",
    },
  ];

  const academicLevels = [
    { id: "9-10", name: "Class 9-10", description: "High school foundation" },
    { id: "11-12", name: "Class 11-12", description: "Senior secondary" },
    {
      id: "undergraduate",
      name: "Undergraduate",
      description: "Bachelor's degree",
    },
    { id: "graduate", name: "Graduate", description: "Master's or above" },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      console.log("=== STARTING ONBOARDING SUBMIT ===");
      console.log("User state:", user);

      // Test authentication first
      console.log("Testing auth endpoint...");
      const authTest = await fetch("/api/test-auth", {
        method: "POST",
        credentials: "include", // Important: include cookies
      });
      const authTestData = await authTest.json();
      console.log("Auth test result:", authTestData);

      if (!authTestData.success) {
        throw new Error("Authentication test failed: " + authTestData.error);
      }

      // Ensure user exists in our database first
      console.log("Ensuring user exists in database...");
      const userEnsureResponse = await fetch("/api/user/ensure-exists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const userEnsureData = await userEnsureResponse.json();
      console.log("User ensure response:", userEnsureData);

      if (!userEnsureResponse.ok) {
        throw new Error(userEnsureData.error || "Failed to ensure user exists");
      }

      // Update user metadata or create user profile in database
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          preferredExams: formData.preferredExams,
          academicLevel: formData.academicLevel,
          goals: formData.goals,
          onboardingCompleted: true,
        },
      });

      // Now call onboarding API to update user with onboarding data
      console.log("Calling onboarding API...");
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Onboarding API response:", responseData);

      if (response.ok) {
        console.log("Onboarding successful:", responseData);
        router.push("/dashboard");
      } else {
        console.error("API Error:", responseData);
        throw new Error(responseData.error || "Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(
        `There was an error saving your information: ${errorMessage}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>
                Help us stay connected with you for important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  We&apos;ll use this for exam notifications and support
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us provide age-appropriate content
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={!formData.phoneNumber || !formData.dateOfBirth}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Your Exam Interests</CardTitle>
              <CardDescription>
                Select the exams you&apos;re preparing for (you can choose multiple)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {examOptions.map((exam) => (
                  <label
                    key={exam.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.preferredExams.includes(exam.id)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      checked={formData.preferredExams.includes(exam.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            preferredExams: [...prev.preferredExams, exam.id],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            preferredExams: prev.preferredExams.filter(
                              (id) => id !== exam.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {exam.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={formData.preferredExams.length === 0}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Academic Level</CardTitle>
              <CardDescription>
                Help us recommend the right content for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {academicLevels.map((level) => (
                  <label
                    key={level.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.academicLevel === level.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="academicLevel"
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                      checked={formData.academicLevel === level.id}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          academicLevel: level.id,
                        }))
                      }
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {level.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {level.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Goals (Optional)
                </label>
                <textarea
                  placeholder="Tell us about your exam goals and what you hope to achieve..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, goals: e.target.value }))
                  }
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!formData.academicLevel || isLoading}
                >
                  {isLoading ? "Setting up..." : "Complete Setup"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i === step
                        ? "bg-purple-600 text-white"
                        : i < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-center text-gray-600">
                Step {step} of 3: Complete your profile setup
              </div>
            </div>

            {/* Welcome message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to AlphaExam, {user?.firstName}!
              </h1>
              <p className="text-lg text-gray-600">
                Let&apos;s set up your profile to personalize your experience
              </p>
            </div>

            {/* Form step */}
            {renderStep()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
