import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, Memory, HardDrive, Activity, Clock, AlertCircle } from 'lucide-react';

// Sample data - replace with your actual data source
const systemData = [
  {
    id: 1,
    name: "Production Server 1",
    status: "Online",
    cpu: 45,
    memory: 62,
    diskSpace: 78,
    responseTime: 120,
    lastTest: "2024-03-15 14:30",
    tests: 150,
    failedTests: 2
  },
  {
    id: 2,
    name: "Production Server 2",
    status: "Online",
    cpu: 65,
    memory: 75,
    diskSpace: 82,
    responseTime: 145,
    lastTest: "2024-03-15 14:30",
    tests: 150,
    failedTests: 0
  },
  {
    id: 3,
    name: "Staging Server",
    status: "Warning",
    cpu: 88,
    memory: 92,
    diskSpace: 95,
    responseTime: 250,
    lastTest: "2024-03-15 14:25",
    tests: 120,
    failedTests: 5
  },
  {
    id: 4,
    name: "Development Server",
    status: "Online",
    cpu: 35,
    memory: 45,
    diskSpace: 55,
    responseTime: 90,
    lastTest: "2024-03-15 14:20",
    tests: 80,
    failedTests: 1
  }
];

const performanceData = [
  { time: '00:00', server1: 120, server2: 145, server3: 250, server4: 90 },
  { time: '04:00', server1: 132, server2: 158, server3: 220, server4: 95 },
  { time: '08:00', server1: 125, server2: 165, server3: 265, server4: 88 },
  { time: '12:00', server1: 145, server2: 175, server3: 255, server4: 98 },
  { time: '16:00', server1: 158, server2: 168, server3: 245, server4: 103 },
  { time: '20:00', server1: 142, server2: 155, server3: 258, server4: 92 },
];

const Performance = () => {
  const [selectedSystem, setSelectedSystem] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMetricColor = (value) => {
    if (value >= 90) return 'text-red-500';
    if (value >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Testing Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
            <Cpu className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests Run</CardTitle>
            <Activity className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemData.reduce((acc, curr) => acc + curr.tests, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {systemData.reduce((acc, curr) => acc + curr.failedTests, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(systemData.reduce((acc, curr) => acc + curr.responseTime, 0) / systemData.length)}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="server1" stroke="#8884d8" name="Server 1" />
                <Line type="monotone" dataKey="server2" stroke="#82ca9d" name="Server 2" />
                <Line type="monotone" dataKey="server3" stroke="#ffc658" name="Server 3" />
                <Line type="monotone" dataKey="server4" stroke="#ff7300" name="Server 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Systems Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Disk Space</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Last Test</TableHead>
                <TableHead>Tests Run</TableHead>
                <TableHead>Failed Tests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemData.map((system) => (
                <TableRow 
                  key={system.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedSystem(system)}
                >
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getMetricColor(system.cpu)}>
                      {system.cpu}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getMetricColor(system.memory)}>
                      {system.memory}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getMetricColor(system.diskSpace)}>
                      {system.diskSpace}%
                    </span>
                  </TableCell>
                  <TableCell>{system.responseTime}ms</TableCell>
                  <TableCell>{system.lastTest}</TableCell>
                  <TableCell>{system.tests}</TableCell>
                  <TableCell className="text-red-500">{system.failedTests}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Details Card */}
      {selectedSystem && (
        <Card>
          <CardHeader>
            <CardTitle>System Details - {selectedSystem.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4">
                <Cpu className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-500">CPU Usage</div>
                  <div className={`text-2xl font-bold ${getMetricColor(selectedSystem.cpu)}`}>
                    {selectedSystem.cpu}%
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Memory className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Memory Usage</div>
                  <div className={`text-2xl font-bold ${getMetricColor(selectedSystem.memory)}`}>
                    {selectedSystem.memory}%
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <HardDrive className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Disk Usage</div>
                  <div className={`text-2xl font-bold ${getMetricColor(selectedSystem.diskSpace)}`}>
                    {selectedSystem.diskSpace}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Performance;