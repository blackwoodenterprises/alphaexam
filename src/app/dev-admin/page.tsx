"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Database, Settings } from "lucide-react";

export default function DevAdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Not Available
          </h1>
          <p className="text-gray-600">
            This page is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/make-admin");
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ ${email} is now an admin!`);
        fetchUsers(); // Refresh the list
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error making admin:", error);
      alert("❌ Failed to make admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchUsers();
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg mb-4">
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Development Admin Tools</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AlphaExam Dev Admin
          </h1>
          <p className="text-gray-600">
            Quick admin access management for development
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Database</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage database state
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/api/admin/make-admin", "_blank")}
                  className="w-full"
                >
                  View All Users (API)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Admin Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Grant admin privileges
              </p>
              {isLoaded && user && (
                <Button
                  onClick={() =>
                    makeAdmin(user.emailAddresses[0]?.emailAddress || "")
                  }
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Make Me Admin
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span>Current User</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoaded && user ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {user.emailAddresses[0]?.emailAddress}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Name:</span> {user.firstName}{" "}
                    {user.lastName}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Clerk ID:</span> {user.id}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Please sign in first</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading users...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  Sign up some users to see them here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Activity
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr
                        key={userItem.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {userItem.firstName} {userItem.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userItem.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              userItem.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {userItem.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {userItem._count.examAttempts} exams
                          </div>
                          <div className="text-xs text-gray-500">
                            {userItem._count.transactions} transactions
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {userItem.role !== "ADMIN" && (
                            <Button
                              size="sm"
                              onClick={() => makeAdmin(userItem.email)}
                              disabled={loading}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            >
                              Make Admin
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <strong>1. Sign up/Sign in:</strong> Use the main site to create
                an account with Clerk
              </div>
              <div>
                <strong>2. Make Admin:</strong> Click "Make Me Admin" to grant
                yourself admin privileges
              </div>
              <div>
                <strong>3. Access Admin Panel:</strong> Go to{" "}
                <code>/admin</code> to access the admin dashboard
              </div>
              <div>
                <strong>4. Database Tools:</strong> Use Prisma Studio with{" "}
                <code>npm run db:studio</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
