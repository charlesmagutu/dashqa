import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Activity, Clock, Filter, Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Enhanced DependencyGraph Component with Interactive Features
const DependencyGraph = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [impactedApps, setImpactedApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dependencyDepth, setDependencyDepth] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications();
    // Set up real-time updates
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/v1/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
    setIsRefreshing(false);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const fetchDependencyTree = async (appId, depth) => {
    try {
      const response = await fetch(`/api/v1/applications/${appId}/dependency-tree?depth=${depth}`);
      const data = await response.json();
      setSelectedApp(prevApp => ({
        ...prevApp,
        dependencyTree: data
      }));
    } catch (error) {
      console.error('Failed to fetch dependency tree:', error);
    }
  };

  const DependencyTreeView = ({ node, level = 0 }) => {
    if (!node) return null;
    
    return (
      <div className="ml-4">
        <div className="flex items-center gap-2 my-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: node.status === 'UP' ? '#10B981' : '#EF4444' }}
          />
          <span className="font-medium">{node.name}</span>
          {node.type && (
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
          )}
        </div>
        {node.dependencies?.map((dep, index) => (
          <DependencyTreeView key={`${dep.id}-${index}`} node={dep} level={level + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UP">Up</SelectItem>
                <SelectItem value="DOWN">Down</SelectItem>
                <SelectItem value="DEGRADED">Degraded</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={dependencyDepth.toString()} 
              onValueChange={(value) => setDependencyDepth(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dependency depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Direct Dependencies</SelectItem>
                <SelectItem value="2">2 Levels Deep</SelectItem>
                <SelectItem value="3">3 Levels Deep</SelectItem>
                <SelectItem value="-1">All Dependencies</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredApplications.map(app => (
          <Card 
            key={app.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              impactedApps.includes(app) ? 'border-red-500' : ''
            }`}
            onClick={() => {
              setSelectedApp(app);
              fetchDependencyTree(app.id, dependencyDepth);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{app.name}</h3>
                <Badge variant={app.status === 'UP' ? 'success' : 'destructive'}>
                  {app.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">{app.description}</p>
              <div className="mt-2 space-x-2">
                {app.features?.length > 0 && (
                  <Badge variant="outline">
                    {app.features.length} Features
                  </Badge>
                )}
                {app.dependencies?.length > 0 && (
                  <Badge variant="outline">
                    {app.dependencies.length} Dependencies
                  </Badge>
                )}
                {impactedApps.includes(app) && (
                  <Badge variant="warning" className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Impacted
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Application Detail */}
      {selectedApp && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Application Details - {selectedApp.name}</span>
              <Badge variant={selectedApp.status === 'UP' ? 'success' : 'destructive'}>
                {selectedApp.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dependencies">
              <TabsList>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dependencies">
                <Card>
                  <CardHeader>
                    <CardTitle>Dependency Tree</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DependencyTreeView node={selectedApp} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <div className="space-y-2">
                  {selectedApp.features?.map(feature => (
                    <Card key={feature.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                        <div className="mt-2 space-x-2">
                          {feature.consumedApis?.map(api => (
                            <Badge
                              key={api.id}
                              variant={api.status === 'UP' ? 'success' : 'destructive'}
                            >
                              {api.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time (ms)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedApp.metrics?.responseTimes || []}>
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#3B82F6" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Error Rate (%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedApp.metrics?.errorRates || []}>
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#EF4444" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Rest of the components remain the same...
const DependencyDashboard = () => {
  // ... (previous implementation)
};

const IncidentTimeline = () => {
  // ... (previous implementation)
};

export default DependencyDashboard;
