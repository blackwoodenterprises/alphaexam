"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  Zap,
  Globe,
  Coffee,
  Laptop,
  GraduationCap,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Target,
  Lightbulb,
  Code,
  Palette,
  BarChart3,
  Headphones,
  Mail,
} from "lucide-react";

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation] = useState("all");

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      description:
        "Build beautiful and performant user interfaces using React, TypeScript, and modern web technologies.",
      requirements: [
        "React/TypeScript expertise",
        "UI/UX design skills",
        "Performance optimization",
        "Testing experience",
      ],
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "4-6 years",
      description:
        "Drive product strategy and roadmap for our exam preparation platform, working closely with engineering and design teams.",
      requirements: [
        "Product management experience",
        "EdTech background preferred",
        "Data-driven mindset",
        "Stakeholder management",
      ],
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      experience: "2-4 years",
      description:
        "Create intuitive and engaging user experiences for millions of students preparing for exams worldwide.",
      requirements: [
        "Design systems experience",
        "Figma proficiency",
        "User research skills",
        "Mobile design expertise",
      ],
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      description:
        "Build and maintain scalable infrastructure to support millions of users taking exams simultaneously.",
      requirements: [
        "AWS/GCP experience",
        "Kubernetes expertise",
        "CI/CD pipelines",
        "Monitoring & alerting",
      ],
    },
    {
      id: 5,
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Austin, TX",
      type: "Full-time",
      experience: "2-4 years",
      description:
        "Develop and execute content strategies to help students discover and succeed with AlphaExam.",
      requirements: [
        "Content strategy",
        "SEO knowledge",
        "Educational content",
        "Analytics proficiency",
      ],
    },
    {
      id: 6,
      title: "Customer Success Specialist",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description:
        "Help students and educators get the most out of AlphaExam through proactive support and guidance.",
      requirements: [
        "Customer service experience",
        "Educational background",
        "Communication skills",
        "Problem-solving ability",
      ],
    },
  ];

  const departments = [
    {
      id: "all",
      name: "All Departments",
      icon: Briefcase,
      count: jobOpenings.length,
    },
    {
      id: "Engineering",
      name: "Engineering",
      icon: Code,
      count: jobOpenings.filter((job) => job.department === "Engineering")
        .length,
    },
    {
      id: "Product",
      name: "Product",
      icon: Target,
      count: jobOpenings.filter((job) => job.department === "Product").length,
    },
    {
      id: "Design",
      name: "Design",
      icon: Palette,
      count: jobOpenings.filter((job) => job.department === "Design").length,
    },
    {
      id: "Marketing",
      name: "Marketing",
      icon: BarChart3,
      count: jobOpenings.filter((job) => job.department === "Marketing").length,
    },
    {
      id: "Support",
      name: "Support",
      icon: Headphones,
      count: jobOpenings.filter((job) => job.department === "Support").length,
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation with equity options",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Calendar,
      title: "Flexible Time Off",
      description: "Unlimited PTO and flexible working hours",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Laptop,
      title: "Remote-First",
      description: "Work from anywhere with home office stipend",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: GraduationCap,
      title: "Learning Budget",
      description: "$2,000 annual budget for courses and conferences",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Coffee,
      title: "Team Events",
      description: "Regular team building and company retreats",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const cultureValues = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We encourage creative thinking and bold ideas that push the boundaries of educational technology.",
    },
    {
      icon: Users,
      title: "Student-Centric",
      description:
        "Every decision we make is guided by what's best for the students who depend on our platform.",
    },
    {
      icon: TrendingUp,
      title: "Growth Mindset",
      description:
        "We believe in continuous learning and improvement, both personally and professionally.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Our work helps millions of students worldwide achieve their educational and career goals.",
    },
  ];

  const companyStats = [
    { label: "Team Members", value: "150+", icon: Users },
    { label: "Countries", value: "25+", icon: Globe },
    { label: "Students Served", value: "2M+", icon: GraduationCap },
    { label: "Years of Growth", value: "5+", icon: TrendingUp },
  ];

  const filteredJobs = jobOpenings.filter((job) => {
    const departmentMatch =
      selectedDepartment === "all" || job.department === selectedDepartment;
    const locationMatch =
      selectedLocation === "all" || job.location.includes(selectedLocation);
    return departmentMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Join Our{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mission
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Help us revolutionize education by building the world&apos;s most
                effective exam preparation platform. Join a team that&apos;s
                passionate about student success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg">
                  <Briefcase className="w-5 h-5 mr-2" />
                  View Open Positions
                </Button>
                <a
                  href="#culture"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                >
                  Learn About Our Culture
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {companyStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm text-center"
                  >
                    <CardContent className="p-6">
                      <Icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why You&apos;ll Love Working Here
              </h2>
              <p className="text-gray-600">
                We believe in taking care of our team so they can do their best
                work and make a real impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Culture & Values */}
        <section id="culture" className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Culture & Values
              </h2>
              <p className="text-gray-600">
                We&apos;re building more than just a product – we&apos;re creating a
                culture where everyone can thrive and make a meaningful impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {cultureValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {value.title}
                          </h3>
                          <p className="text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-gray-600">
                Find your next opportunity and help us shape the future of
                education.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      selectedDepartment === dept.id
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{dept.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedDepartment === dept.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {dept.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Job Listings */}
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {job.department}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Key Requirements:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg w-full lg:w-auto">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No positions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later for new
                  opportunities.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Hiring Process
              </h2>
              <p className="text-gray-600">
                We&apos;ve designed our hiring process to be transparent, efficient,
                and focused on finding the right fit for both you and our team.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: 1,
                    title: "Application",
                    description:
                      "Submit your application and we'll review it within 3 business days",
                    icon: Briefcase,
                  },
                  {
                    step: 2,
                    title: "Phone Screen",
                    description:
                      "30-minute conversation with our recruiting team",
                    icon: Users,
                  },
                  {
                    step: 3,
                    title: "Technical Interview",
                    description:
                      "Role-specific interview with the hiring manager and team",
                    icon: Zap,
                  },
                  {
                    step: 4,
                    title: "Final Interview",
                    description:
                      "Culture fit interview and meet your potential teammates",
                    icon: Heart,
                  },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">
                            {step.step}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Don&apos;t See the Right Role?
              </h2>
              <p className="text-gray-600 mb-8">
                We&apos;re always looking for talented individuals who share our
                passion for education. Send us your resume and tell us how you&apos;d
                like to contribute to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Us Your Resume
                </Button>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
