"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableDropdown, DropdownOption } from "@/components/ui/dropdown";
import {
  Users,
  BookOpen,
  GraduationCap,
  Settings,
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
  {
    value: "sarah-wilson",
    label: "Sarah Wilson",
    description: "Instructor",
    icon: Users,
  },
  {
    value: "david-brown",
    label: "David Brown",
    description: "Student",
    icon: Users,
  },
];

const categoryOptions: DropdownOption[] = [
  {
    value: "mathematics",
    label: "Mathematics",
    description: "Algebra, Calculus, Geometry",
    icon: BookOpen,
  },
  {
    value: "physics",
    label: "Physics",
    description: "Mechanics, Thermodynamics, Optics",
    icon: BookOpen,
  },
  {
    value: "chemistry",
    label: "Chemistry",
    description: "Organic, Inorganic, Physical",
    icon: BookOpen,
  },
  {
    value: "biology",
    label: "Biology",
    description: "Botany, Zoology, Genetics",
    icon: BookOpen,
  },
  {
    value: "computer-science",
    label: "Computer Science",
    description: "Programming, Algorithms, Data Structures",
    icon: Code,
  },
];

const examOptions: DropdownOption[] = [
  {
    value: "jee-main",
    label: "JEE Main",
    description: "Joint Entrance Examination - Main",
    icon: GraduationCap,
  },
  {
    value: "jee-advanced",
    label: "JEE Advanced",
    description: "Joint Entrance Examination - Advanced",
    icon: GraduationCap,
  },
  {
    value: "neet",
    label: "NEET",
    description: "National Eligibility cum Entrance Test",
    icon: GraduationCap,
  },
  {
    value: "gate",
    label: "GATE",
    description: "Graduate Aptitude Test in Engineering",
    icon: GraduationCap,
  },
  {
    value: "cat",
    label: "CAT",
    description: "Common Admission Test",
    icon: GraduationCap,
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
  {
    value: "suspended",
    label: "Suspended",
    description: "Temporarily suspended",
    disabled: true,
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

export function ComponentsDemo() {
  const [singleValue, setSingleValue] = useState<string>("");
  const [multipleValues, setMultipleValues] = useState<string[]>([]);
  const [userValue, setUserValue] = useState<string>("");
  const [categoryValues, setCategoryValues] = useState<string[]>([]);
  const [examValue, setExamValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [priorityValue, setPriorityValue] = useState<string>("");
  const [loadingValue, setLoadingValue] = useState<string>("");
  const [errorValue, setErrorValue] = useState<string>("");

  return (
    <div className="space-y-8">
      {/* Basic Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-purple-600" />
            <span>Basic Dropdown Examples</span>
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
          </div>
        </CardContent>
      </Card>

      {/* Advanced Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <span>Advanced Examples</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* With Icons and Descriptions */}
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

            {/* Multiple with Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Multiple Categories
              </h3>
              <SearchableDropdown
                options={categoryOptions}
                value={categoryValues}
                onChange={(value) => setCategoryValues(value as string[])}
                placeholder="Select categories..."
                searchPlaceholder="Search categories..."
                label="Categories"
                multiple
                maxHeight="150px"
              />
            </div>

            {/* Large Dataset */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Large Dataset
              </h3>
              <SearchableDropdown
                options={examOptions}
                value={examValue}
                onChange={(value) => setExamValue(value as string)}
                placeholder="Select an exam..."
                searchPlaceholder="Search exams..."
                label="Exam Type"
                size="lg"
              />
            </div>

            {/* Different Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Different Sizes
              </h3>
              <div className="space-y-3">
                <SearchableDropdown
                  options={statusOptions.slice(0, 3)}
                  value={statusValue}
                  onChange={(value) => setStatusValue(value as string)}
                  placeholder="Small size..."
                  size="sm"
                />
                <SearchableDropdown
                  options={statusOptions.slice(0, 3)}
                  value={priorityValue}
                  onChange={(value) => setPriorityValue(value as string)}
                  placeholder="Default size..."
                  size="default"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-purple-600" />
            <span>State Examples</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading State */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Loading State
              </h3>
              <SearchableDropdown
                options={[]}
                value={loadingValue}
                onChange={(value) => setLoadingValue(value as string)}
                placeholder="Loading..."
                label="Loading Example"
                loading
              />
            </div>

            {/* Error State */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Error State
              </h3>
              <SearchableDropdown
                options={statusOptions}
                value={errorValue}
                onChange={(value) => setErrorValue(value as string)}
                placeholder="Select option..."
                label="Error Example"
                error="This field is required"
              />
            </div>

            {/* Disabled State */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Disabled State
              </h3>
              <SearchableDropdown
                options={statusOptions}
                value=""
                onChange={() => {}}
                placeholder="Disabled dropdown..."
                label="Disabled Example"
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Code Examples */}
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

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Multiple Selection
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono">
                <pre className="text-gray-800">
{`<SearchableDropdown
  options={options}
  value={selectedValues}
  onChange={setSelectedValues}
  placeholder="Select multiple options..."
  label="Multiple Selection"
  multiple
  clearable
/>`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}