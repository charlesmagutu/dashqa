import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Globe, AlertCircle, ArrowUpCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ApiDashboard = () => {
  // Sample data - replace with actual API metrics
  const performanceData = [
    { time: '00:00', latency: 120, errors: 2, requests: 850 },
    { time: '04:00', latency: 140, errors: 1, requests: 950 },
    { time: '08:00', latency: 180, errors: 3, requests: 1200 },
    { time: '12:00', latency: 250, errors: 5, requests: 1500 },
    { time: '16:00', latency: 200, errors: 2, requests: 1300 },
    { time: '20:00', latency: 150, errors: 1, requests: 1000 },
  ];

  const apiEndpoints = [
    {
      id: 1,
      name: "/users/authenticate",
      method: "POST",
      status: "healthy",
      uptime: "99.99%",
      avgLatency: "125ms",
      errorRate: "0.1%",
      lastCall: "2 min ago"
    },
    {
      id: 2,
      name: "/orders/create",
      method: "POST",
      status: "degraded",
      uptime: "98.5%",
      avgLatency: "350ms",
      errorRate: "2.5%",
      lastCall: "30 sec ago"
    },
    {
      id: 3,
      name: "/products",
      method: "GET",
      status: "healthy",
      uptime: "99.95%",
      avgLatency: "89ms",
      errorRate: "0.05%",
      lastCall: "5 sec ago"
    },
    {
      id: 4,
      name: "/payments/process",
      method: "POST",
      status: "down",
      uptime: "95.5%",
      avgLatency: "500ms",
      errorRate: "5.0%",
      lastCall: "15 min ago"
    }
  ];

  const getStatusIndicator = (status) => {
    const config = {
      healthy: { color: "text-green-500", icon: CheckCircle, bg: "bg-green-50" },
      degraded: { color: "text-yellow-500", icon: Clock, bg: "bg-yellow-50" },
      down: { color: "text-red-500", icon: XCircle, bg: "bg-red-50" }
    };
    
    const StatusIcon = config[status].icon;
    
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config[status].bg}`}>
        <StatusIcon className={`w-4 h-4 ${config[status].color}`} />
        <span className={`text-sm font-medium ${config[status].color}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Monitor</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            View Alerts
          </Button>
          <Button className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Test All Endpoints
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Globe className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-green-600">↑ 12% from last hour</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145ms</div>
            <p className="text-xs text-red-600">↑ 23ms from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.12%</div>
            <p className="text-xs text-green-600">↓ 0.08% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <ArrowUpCircle className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.99%</div>
            <p className="text-xs text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#3b82f6" name="Latency (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#10b981" name="Requests" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* API Endpoints Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Endpoint</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Uptime</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Avg Latency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Error Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Last Call</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((endpoint) => (
                  <tr 
                    key={endpoint.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{endpoint.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusIndicator(endpoint.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{endpoint.uptime}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{endpoint.avgLatency}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{endpoint.errorRate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{endpoint.lastCall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDashboard;