"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
  Database,
  Globe,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const overallStatus = {
    status: "operational",
    message: "All systems operational",
    lastUpdated: currentTime,
  };

  const services = [
    {
      name: "Web Application",
      description: "Main AlphaExam platform and dashboard",
      status: "operational",
      uptime: "99.98%",
      responseTime: "245ms",
      icon: Globe,
    },
    {
      name: "Test Engine",
      description: "Mock test delivery and scoring system",
      status: "operational",
      uptime: "99.95%",
      responseTime: "180ms",
      icon: Zap,
    },
    {
      name: "Database",
      description: "User data and content storage",
      status: "operational",
      uptime: "99.99%",
      responseTime: "45ms",
      icon: Database,
    },
    {
      name: "API Services",
      description: "Backend services and integrations",
      status: "operational",
      uptime: "99.97%",
      responseTime: "120ms",
      icon: Server,
    },
    {
      name: "Authentication",
      description: "User login and security services",
      status: "operational",
      uptime: "99.99%",
      responseTime: "95ms",
      icon: Shield,
    },
    {
      name: "Content Delivery",
      description: "Static assets and media delivery",
      status: "operational",
      uptime: "99.96%",
      responseTime: "85ms",
      icon: Activity,
    },
  ];

  const recentIncidents = [
    {
      date: "2025-01-10",
      title: "Scheduled Maintenance - Database Optimization",
      status: "resolved",
      duration: "2 hours",
      impact: "Low",
      description:
        "Performed routine database optimization to improve query performance. No user data was affected.",
    },
    {
      date: "2025-01-05",
      title: "Brief API Slowdown",
      status: "resolved",
      duration: "15 minutes",
      impact: "Medium",
      description:
        "Experienced temporary API response delays due to increased traffic. Issue resolved by scaling infrastructure.",
    },
    {
      date: "2024-12-28",
      title: "CDN Cache Refresh",
      status: "resolved",
      duration: "30 minutes",
      impact: "Low",
      description:
        "Updated content delivery network cache. Some users may have experienced slower image loading temporarily.",
    },
  ];

  const uptimeStats = [
    { period: "Last 24 hours", uptime: "100%", color: "text-green-600" },
    { period: "Last 7 days", uptime: "99.98%", color: "text-green-600" },
    { period: "Last 30 days", uptime: "99.95%", color: "text-green-600" },
    { period: "Last 90 days", uptime: "99.92%", color: "text-green-600" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-50 border-green-200";
      case "degraded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "outage":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                System{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Status
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Real-time status and performance monitoring of all AlphaExam
                services and infrastructure.
              </p>

              {/* Overall Status */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4">
                    {getStatusIcon(overallStatus.status)}
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {overallStatus.message}
                      </h2>
                      <p className="text-gray-600">
                        Last updated: {currentTime.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Uptime Statistics */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Uptime Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {uptimeStats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {stat.period}
                    </h3>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.uptime}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Service Status
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Uptime</p>
                            <p className="font-semibold text-green-600">
                              {service.uptime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Response Time
                            </p>
                            <p className="font-semibold text-blue-600">
                              {service.responseTime}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(service.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                service.status
                              )}`}
                            >
                              {service.status.charAt(0).toUpperCase() +
                                service.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Recent Incidents
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {recentIncidents.map((incident, index) => (
                <Card
                  key={index}
                  className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {incident.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{incident.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{incident.duration}</span>
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                incident.impact === "Low"
                                  ? "bg-green-100 text-green-700"
                                  : incident.impact === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {incident.impact} Impact
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Resolved
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {incident.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Stay Updated
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Subscribe to receive notifications about system status
                    updates, maintenance schedules, and incident reports.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                      Subscribe to Updates
                    </button>
                    <a
                      href="/help"
                      className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300"
                    >
                      Contact Support
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
