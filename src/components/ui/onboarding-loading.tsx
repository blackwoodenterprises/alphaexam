"use client";

import { useState, useEffect } from "react";
import { Sparkles, Rocket, Trophy, Star, Zap, Heart } from "lucide-react";

interface OnboardingLoadingProps {
  isVisible: boolean;
}

const loadingMessages = [
  { text: "Setting up your personalized dashboard...", icon: Sparkles, color: "text-purple-500" },
  { text: "Preparing your exam journey...", icon: Rocket, color: "text-blue-500" },
  { text: "Adding 100 bonus credits to your account...", icon: Trophy, color: "text-yellow-500" },
  { text: "Customizing your learning experience...", icon: Star, color: "text-pink-500" },
  { text: "Almost ready to launch your success...", icon: Zap, color: "text-green-500" },
  { text: "Welcome to your exam preparation hub!", icon: Heart, color: "text-red-500" },
];

const floatingEmojis = ["🚀", "✨", "🎯", "📚", "🏆", "💫", "🌟", "🎉", "💪", "🔥"];

export function OnboardingLoading({ isVisible }: OnboardingLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; emoji: string; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Generate floating elements
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setFloatingElements(elements);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    // Message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentMessage = loadingMessages[currentMessageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-pink-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-2xl opacity-20 animate-bounce"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Animated Logo/Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <IconComponent className={`w-12 h-12 ${currentMessage.color} animate-bounce`} />
            </div>
            {/* Rotating rings */}
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 border-4 border-white/30 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in">
            Getting Everything Ready!
          </h2>
          <p className={`text-lg ${currentMessage.color} transition-all duration-500 animate-fade-in`}>
            {currentMessage.text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/80 text-sm mt-2">
            {Math.min(Math.round(progress), 100)}% Complete
          </p>
        </div>

        {/* Fun Facts */}
        <div className="text-white/70 text-sm animate-fade-in">
          <p className="mb-2">💡 <strong>Did you know?</strong></p>
          <p className="italic">
            {currentMessageIndex % 3 === 0 && "Students who set clear goals are 10x more likely to succeed!"}
            {currentMessageIndex % 3 === 1 && "Your personalized dashboard will track your progress in real-time!"}
            {currentMessageIndex % 3 === 2 && "You're about to join thousands of successful exam achievers!"}
          </p>
        </div>

        {/* Pulsing dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}