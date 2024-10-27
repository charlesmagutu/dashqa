import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Check, ArrowDown, ArrowUp, Search, Filter, Settings, RefreshCcw, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EnhancedDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [impactAnalysis, setImpactAnalysis] = useState(null);
  const [apiStatus, setApiStatus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedView, setSelectedView] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    status: 'all',
    team: 'all',
    severity: 'all'
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange, filterCriteria]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchApplications(),
        fetchApiStatus(),
        selectedApp && fetchImpactAnalysis(selectedApp.id)
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/v1/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchApiStatus = async () => {
    try {
      const response = await fetch('/api/v1/apis/affected');
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      console.error('Error fetching API status:', error);
    }
  };

  const fetchImpactAnalysis = async (appId) => {
    try {
      const response = await fetch(`/api/v1/applications/${appId}/impact`);
      const data = await response.json();
      setImpactAnalysis(data);
    } catch (error) {
      console.error('Error fetching impact analysis:', error);
    }
  };

  const handleExportData = () => {
    const data = {
      applications,
      apiStatus,
      impactAnalysis
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dependency-analysis.json';
    a.click();
  };

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCriteria.status === 'all' || app.status === filterCriteria.status) &&
    (filterCriteria.team === 'all' || app.team === filterCriteria.team)
  );

  const healthScore = Math.round(
    (applications.filter(app => app.status === 'UP').length / applications.length) * 100
  );

  return (
    <div className="w-full space-y-4 p-4">
      {/* Control Panel */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter Options</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Select
                      value={filterCriteria.status}
                      onValueChange={(value) =>
                        setFilterCriteria({ ...filterCriteria, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="UP">Up</SelectItem>
                        <SelectItem value="DOWN">Down</SelectItem>
                        <SelectItem value="DEGRADED">Degraded</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Add more filter options */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={[{ value: healthScore }, { value: 100 - healthScore }]}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="text-center mt-4">
                  <div className="text-2xl font-bold">{healthScore}%</div>
                  <div className="text-sm text-gray-500">Overall Health</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {apiStatus.map((api) => (
                    <Alert key={api.id} variant={api.status === 'UP' ? 'default' : 'destructive'}>
                      <AlertTitle className="flex items-center gap-2">
                        {api.name}
                        {api.status === 'UP' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </AlertTitle>
                      <AlertDescription>
                        Last checked: {new Date(api.lastCheck).toLocaleTimeString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Affected Applications</span>
                    <span className="font-bold">{impactAnalysis?.affectedApplications?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Critical Services</span>
                    <span className="font-bold text-red-500">
                      {impactAnalysis?.criticalServices || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Dependencies</span>
                    <span className="font-bold">{impactAnalysis?.totalDependencies || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Metrics Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  width={800}
                  height={300}
                  data={impactAnalysis?.timeSeriesData || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="health" stroke="#8884d8" />
                  <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="errors" stroke="#ff7300" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  );
};

export default EnhancedDashboard;
