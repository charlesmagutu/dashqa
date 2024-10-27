import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { AlertCircle, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DependencyDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [impactAnalysis, setImpactAnalysis] = useState(null);
  const [apiStatus, setApiStatus] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchApiStatus();
    const interval = setInterval(fetchApiStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

  const renderStatusIndicator = (status) => {
    return status === 'UP' ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const renderTrendIndicator = (trend) => {
    return trend > 0 ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="w-full space-y-4 p-4">
      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                Applications
                {renderTrendIndicator(1)}
              </AlertTitle>
              <AlertDescription>
                {applications.length} Total Applications
              </AlertDescription>
            </Alert>

            <Alert variant={apiStatus.length > 0 ? "destructive" : "default"}>
              <AlertTitle className="flex items-center gap-2">
                API Status
                {renderStatusIndicator(apiStatus.length === 0 ? 'UP' : 'DOWN')}
              </AlertTitle>
              <AlertDescription>
                {apiStatus.length} Affected APIs
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTitle>Dependency Health</AlertTitle>
              <AlertDescription>
                {impactAnalysis?.totalImpact || 0}% System Impact
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      {impactAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <LineChart
                width={800}
                height={250}
                data={impactAnalysis.timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impactScore" stroke="#8884d8" />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affected Applications */}
      {impactAnalysis?.affectedApplications && (
        <Card>
          <CardHeader>
            <CardTitle>Affected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {impactAnalysis.affectedApplications.map((app) => (
                <Alert key={app.id} variant="warning">
                  <AlertTitle>{app.name}</AlertTitle>
                  <AlertDescription>
                    Impact Score: {app.impactScore}%
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DependencyDashboard;
