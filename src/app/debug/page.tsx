import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DebugPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  let dbUser = null;
  if (userId) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("Error fetching user from DB:", error);
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clerk Authentication</CardTitle>
            <CardDescription>Current authentication status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {userId || "Not signed in"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {clerkUser?.emailAddresses[0]?.emailAddress || "N/A"}
              </p>
              <p>
                <strong>Name:</strong> {clerkUser?.firstName}{" "}
                {clerkUser?.lastName}
              </p>
              <p>
                <strong>Signed In:</strong> {userId ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database User</CardTitle>
            <CardDescription>User record in our database</CardDescription>
          </CardHeader>
          <CardContent>
            {dbUser ? (
              <div className="space-y-2">
                <p>
                  <strong>DB ID:</strong> {dbUser.id}
                </p>
                <p>
                  <strong>Clerk ID:</strong> {dbUser.clerkId}
                </p>
                <p>
                  <strong>Email:</strong> {dbUser.email}
                </p>
                <p>
                  <strong>Name:</strong> {dbUser.firstName} {dbUser.lastName}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      dbUser.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {dbUser.role}
                  </span>
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(dbUser.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Admin Access:</strong>{" "}
                  {dbUser.role === "ADMIN" ? "✅ Yes" : "❌ No"}
                </p>
              </div>
            ) : userId ? (
              <p className="text-red-600">❌ User not found in database</p>
            ) : (
              <p className="text-gray-500">Not signed in</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Things you can do to fix issues</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {!userId && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-medium text-yellow-800">
                  You need to sign in first
                </p>
                <p className="text-yellow-700">
                  Go to{" "}
                  <Link href="/sign-up" className="underline">
                    /sign-up
                  </Link>{" "}
                  or{" "}
                  <Link href="/sign-in" className="underline">
                    /sign-in
                  </Link>
                </p>
              </div>
            )}

            {userId && !dbUser && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-800">
                  User not found in database
                </p>
                <p className="text-red-700">
                  Complete onboarding at{" "}
                  <a href="/onboarding" className="underline">
                    /onboarding
                  </a>
                </p>
              </div>
            )}

            {userId && dbUser && dbUser.role !== "ADMIN" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="font-medium text-blue-800">
                  You need admin access
                </p>
                <p className="text-blue-700">
                  Go to{" "}
                  <a href="/dev-admin" className="underline">
                    /dev-admin
                  </a>{" "}
                  and click &quot;Make Me Admin&quot;
                </p>
              </div>
            )}

            {userId && dbUser && dbUser.role === "ADMIN" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="font-medium text-green-800">
                  ✅ All good! You have admin access
                </p>
                <p className="text-green-700">
                  You can access{" "}
                  <a href="/admin" className="underline">
                    /admin
                  </a>{" "}
                  now
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
