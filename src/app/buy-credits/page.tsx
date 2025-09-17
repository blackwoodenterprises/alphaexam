"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuyCreditsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pricing");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to pricing...</p>
      </div>
    </div>
  );
}