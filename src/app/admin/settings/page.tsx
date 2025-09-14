import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Database,
  Mail,
  Shield,
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
        <div className="relative">
          <Input
            label={setting.label}
            type="password"
            value={String(setting.value)}
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
      <Input
        label={setting.label}
        type={setting.type}
        value={String(setting.value)}
        readOnly
      />
    </div>
  );
}
