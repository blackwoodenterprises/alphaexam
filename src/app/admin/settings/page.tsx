import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Bell,
  CreditCard,
  Users,
  Save,
  RefreshCw,
  Eye,
} from "lucide-react";

export default async function SettingsPage() {

  const settingsSections = [
    {
      title: "General Settings",
      icon: Settings,
      settings: [
        {
          key: "siteName",
          label: "Site Name",
          value: "AlphaExam",
          type: "text",
        },
        {
          key: "siteDescription",
          label: "Site Description",
          value: "Best online mock testing platform in India",
          type: "text",
        },
        {
          key: "maintenanceMode",
          label: "Maintenance Mode",
          value: false,
          type: "boolean",
        },
        {
          key: "registrationEnabled",
          label: "User Registration",
          value: true,
          type: "boolean",
        },
      ],
    },
    {
      title: "Payment Settings",
      icon: CreditCard,
      settings: [
        {
          key: "razorpayKeyId",
          label: "Razorpay Key ID",
          value: "rzp_test_*****",
          type: "password",
        },
        {
          key: "razorpayKeySecret",
          label: "Razorpay Key Secret",
          value: "**********",
          type: "password",
        },
        {
          key: "defaultCreditPrice",
          label: "Default Credit Price (₹)",
          value: "10",
          type: "number",
        },
        {
          key: "minPurchaseAmount",
          label: "Minimum Purchase (₹)",
          value: "100",
          type: "number",
        },
      ],
    },
    {
      title: "Email Settings",
      icon: Mail,
      settings: [
        {
          key: "smtpHost",
          label: "SMTP Host",
          value: "smtp.gmail.com",
          type: "text",
        },
        { key: "smtpPort", label: "SMTP Port", value: "587", type: "number" },
        {
          key: "smtpUser",
          label: "SMTP Username",
          value: "admin@alphaexam.com",
          type: "email",
        },
        {
          key: "smtpPassword",
          label: "SMTP Password",
          value: "**********",
          type: "password",
        },
      ],
    },
    {
      title: "Security Settings",
      icon: Shield,
      settings: [
        {
          key: "sessionTimeout",
          label: "Session Timeout (minutes)",
          value: "60",
          type: "number",
        },
        {
          key: "passwordMinLength",
          label: "Min Password Length",
          value: "8",
          type: "number",
        },
        {
          key: "twoFactorAuth",
          label: "Require 2FA for Admins",
          value: false,
          type: "boolean",
        },
        {
          key: "ipWhitelist",
          label: "IP Whitelist (Admin)",
          value: "",
          type: "text",
        },
      ],
    },
    {
      title: "Exam Settings",
      icon: Users,
      settings: [
        {
          key: "defaultExamDuration",
          label: "Default Exam Duration (minutes)",
          value: "60",
          type: "number",
        },
        {
          key: "maxAttempts",
          label: "Max Attempts Per Exam",
          value: "3",
          type: "number",
        },
        {
          key: "autoSubmit",
          label: "Auto Submit on Time End",
          value: true,
          type: "boolean",
        },
        {
          key: "showAnswers",
          label: "Show Answers After Completion",
          value: true,
          type: "boolean",
        },
      ],
    },
    {
      title: "Notification Settings",
      icon: Bell,
      settings: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          value: true,
          type: "boolean",
        },
        {
          key: "smsNotifications",
          label: "SMS Notifications",
          value: false,
          type: "boolean",
        },
        {
          key: "newUserNotification",
          label: "Notify on New User",
          value: true,
          type: "boolean",
        },
        {
          key: "paymentNotification",
          label: "Notify on Payment",
          value: true,
          type: "boolean",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        user={{
          firstName: "Admin",
          lastName: "User",
          email: "admin@alphaexam.com"
        }}
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button variant="outline">
          <Database className="w-4 h-4 mr-2" />
          Backup Settings
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <section.icon className="w-5 h-5 text-purple-600" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <SettingItem key={settingIndex} setting={setting} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Version</p>
              <p className="text-lg font-semibold text-gray-900">1.0.0</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Environment</p>
              <p className="text-lg font-semibold text-gray-900">Production</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Database</p>
              <p className="text-lg font-semibold text-gray-900">PostgreSQL</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-900">Clear All Cache</h3>
                <p className="text-sm text-red-700">
                  Remove all cached data and force refresh
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-100"
              >
                Clear Cache
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-900">Reset Database</h3>
                <p className="text-sm text-red-700">
                  ⚠️ This will permanently delete all data
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-100"
              >
                Reset Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Setting Item Component
interface Setting {
  key: string;
  label: string;
  value: string | boolean | number;
  type: string;
}

function SettingItem({ setting }: { setting: Setting }) {
  if (setting.type === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">
            {setting.label}
          </label>
        </div>
        <div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              setting.value ? "bg-purple-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  if (setting.type === "password") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {setting.label}
        </label>
        <div className="relative">
          <input
            type="password"
            value={String(setting.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            readOnly
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {setting.label}
      </label>
      <input
        type={setting.type}
        value={String(setting.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
}
