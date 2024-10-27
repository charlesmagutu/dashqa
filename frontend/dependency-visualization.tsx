import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const DependencyGraph = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [impactedApps, setImpactedApps] = useState([]);
  
  useEffect(() => {
    // Fetch applications data
    fetch('/api/v1/applications')
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);
  
  const handleApiStatusChange = async (apiId, newStatus) => {
    if (newStatus === 'DOWN') {
      const impacted = await fetch(`/api/v1/impact-analysis/api/${apiId}`)
        .then(res => res.json());
      setImpactedApps(impacted);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {applications.map(app => (
              <Card 
                key={app.id}
                className={`cursor-pointer ${
                  impactedApps.includes(app) ? 'border-red-500' : ''
                }`}
                onClick={() => setSelectedApp(app)}
              >
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{app.name}</h3>
                  <p className="text-sm text-gray-600">{app.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={app.status === 'UP' ? 'success' : 'destructive'}>
                      {app.status}
                    </Badge>
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
        </CardContent>
      </Card>

      {selectedApp && (
        <Card>
          <CardHeader>
            <CardTitle>Dependency Graph - {selectedApp.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Direct Dependencies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedApp.dependencies.map(dep => (
                  <Badge key={dep.id} variant="outline">
                    {dep.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Features & APIs</h4>
              <div className="space-y-2">
                {selectedApp.features.map(feature => (
                  <Card key={feature.id} className="p-2">
                    <h5 className="font-medium">{feature.name}</h5>
                    <div className="ml-4">
                      {feature.consumedApis.map(api => (
                        <Badge
                          key={api.id}
                          variant={api.status === 'UP' ? 'success' : 'destructive'}
                          className="mr-2"
                        >
                          {api.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DependencyGraph;
