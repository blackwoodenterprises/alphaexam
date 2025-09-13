"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableDropdown, DropdownOption } from "@/components/ui/dropdown";
import {
  Users,
  Code,
  Palette,
  Star,
  Heart,
  Zap,
} from "lucide-react";

// Sample data for different dropdown examples
const userOptions: DropdownOption[] = [
  {
    value: "john-doe",
    label: "John Doe",
    description: "Administrator",
    icon: Users,
  },
  {
    value: "jane-smith",
    label: "Jane Smith",
    description: "Content Manager",
    icon: Users,
  },
  {
    value: "mike-johnson",
    label: "Mike Johnson",
    description: "Student",
    icon: Users,
  },
];

const statusOptions: DropdownOption[] = [
  {
    value: "active",
    label: "Active",
    description: "Currently active",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Currently inactive",
  },
  {
    value: "pending",
    label: "Pending",
    description: "Awaiting approval",
  },
];

const priorityOptions: DropdownOption[] = [
  {
    value: "high",
    label: "High Priority",
    description: "Urgent items",
    icon: Zap,
  },
  {
    value: "medium",
    label: "Medium Priority",
    description: "Standard items",
    icon: Star,
  },
  {
    value: "low",
    label: "Low Priority",
    description: "Non-urgent items",
    icon: Heart,
  },
];

export default function ComponentsDemoPage() {
  const [singleValue, setSingleValue] = useState<string>("");
  const [multipleValues, setMultipleValues] = useState<string[]>([]);
  const [userValue, setUserValue] = useState<string>("");
  const [priorityValue, setPriorityValue] = useState<string>("");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            UI Components Demo
          </h1>
        </div>
        <p className="text-gray-600">
          Interactive showcase of the SearchableDropdown component.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span>SearchableDropdown Examples</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Select */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Single Select
                </h3>
                <SearchableDropdown
                  options={statusOptions}
                  value={singleValue}
                  onChange={(value) => setSingleValue(value as string)}
                  placeholder="Choose a status..."
                  label="Status"
                  clearable
                />
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {singleValue || "None"}
                </p>
              </div>

              {/* Multiple Select */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Multiple Select
                </h3>
                <SearchableDropdown
                  options={priorityOptions}
                  value={multipleValues}
                  onChange={(value) => setMultipleValues(value as string[])}
                  placeholder="Choose priorities..."
                  label="Priorities"
                  multiple
                  clearable
                />
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {multipleValues.length > 0 ? multipleValues.join(", ") : "None"}
                </p>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  With Icons & Descriptions
                </h3>
                <SearchableDropdown
                  options={userOptions}
                  value={userValue}
                  onChange={(value) => setUserValue(value as string)}
                  placeholder="Select a user..."
                  searchPlaceholder="Search users..."
                  label="User"
                  required
                />
              </div>

              {/* Different Sizes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Different Sizes
                </h3>
                <div className="space-y-3">
                  <SearchableDropdown
                    options={statusOptions.slice(0, 2)}
                    value={priorityValue}
                    onChange={(value) => setPriorityValue(value as string)}
                    placeholder="Small size..."
                    size="sm"
                  />
                  <SearchableDropdown
                    options={statusOptions.slice(0, 2)}
                    value={""}
                    onChange={() => {}}
                    placeholder="Large size..."
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-600" />
              <span>Usage Examples</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Basic Usage
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono">
                  <pre className="text-gray-800">
{`import { SearchableDropdown } from '@/components/ui/searchable-dropdown';

const options = [
  { value: 'option1', label: 'Option 1', description: 'First option' },
  { value: 'option2', label: 'Option 2', description: 'Second option' },
];

<SearchableDropdown
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option..."
  label="Example Dropdown"
  clearable
/>`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}