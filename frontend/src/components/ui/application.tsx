import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppWindow, Play, TestTube2, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Application : React.FC = () => {
  const navigate = useNavigate();

  const metrics = {
    totalApplications: 12,
    totalRuns: 156,
    totalTestCases: 789,
  };

  const applications = [
    { id: 1, name: "Customer Portal", lastRun: "2024-11-12", status: "Passed", totalTests: 45, successRate: "92%" },
    { id: 2, name: "Admin Application", lastRun: "2024-11-11", status: "Failed", totalTests: 38, successRate: "87%" },
    { id: 3, name: "Mobile App", lastRun: "2024-11-10", status: "Passed", totalTests: 62, successRate: "95%" },
  ];

  const handleViewDetails = (appId:string) => {
    navigate(`./runs/${appId}`);
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Test Execution Results</CardTitle>
          <div className="flex space-x-4">
            
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Systems</p>
            <p className="text-2xl font-bold">{10}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Total Test Cases</p>
            <p className="text-2xl font-bold">{})</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Total Runs</p>
            <p className="text-2xl font-bold">{}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Avg Duration</p>
            <p className="text-2xl font-bold">{6} s</p>
          </div>
        </div>        
      </CardHeader>
    </Card>
  );
};

export default Application;
