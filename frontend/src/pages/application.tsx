import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from "@/hooks/alert-hook";
import CustomAlert from "@/components/ui/custom-alert";
import { format } from 'date-fns';
import TestRun from './testrun';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useGenericContext } from '@/GenericContex';

interface Applications {
  id: number;
  name: string;
  description: string;
  version: string;
  owningTeam: string;
  technicalOwner: string;
  createdAt: string | null;
  updatedAt: string | null;
  status: string;
  features: any[];
  dependencies: any[];
  consumedApis: any[];
}

const ApplicationsDashboard = () => {
  //const {setSelectedRow} = useRowContext();
  const {setSelectedItem, selectedItem} = useGenericContext<Applications>();
  const [applications, setApplications] = useState<Applications[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { alert, isVisible, showAlert } = Alert();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runName, setRunName] = useState('');
  const [description, setDescription] = useState('');
  const [browser, setBrowser] = useState('chrome');
  const [environment, setEnvironment] = useState('SIT');
  
  // Robot Framework arguments
  const [dryRun, setDryRun] = useState(false);
  const [log, setLog] = useState(false);
  const [report, setReport] = useState(false);
  const [output, setOutput] = useState(false);
  const [includeTags, setIncludeTags] = useState(false);
  const [excludeTags, setExcludeTags] = useState(false);
  
  const [captureScreenshot, setCaptureScreenshot] = useState(false);
  const [videoRecording, setVideoRecording] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const payload = {
      run_id: "12345", // Replace with dynamically generated or user-provided ID
      environment,
      browser,
      dryRun,
      log,
      report,
      output,
      includeTags:[],
      excludeTags:[],
      captureScreenshot,
      videoRecording,
      scriptFolder: "/home/condabu/development/dashqa/testrunner/suites/Omni",
      headless: true,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8081/api/v1/start-test/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Test started successfully:", data);
      alert("Test run started successfully!");
      setIsModalOpen(false); // Close the modal after successful submission
    } catch (error) {
      console.error("Failed to start test run:", error);
      alert("Failed to start test run. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();

  // const handleAppChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = event.target;
  //   setSelectedRow(prev =>
  //     checked ? [...prev, value] : prev.filter(app => app !== value)
  //   );
  // };

  const listApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8081/api/v1/app");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data: Applications[] = await response.json();
      setApplications(data);
    } catch (err) {
      showAlert("error", "Error occurred while loading applications");
      setError("Error occurred while loading applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
      up: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      down: { color: "bg-red-100 text-red-800", icon: XCircle },
      running: { color: "bg-blue-100 text-blue-800", icon: Clock },
    };

    const config = statusConfig[status.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleRowClick = (app: Applications) => {
    setSelectedItem(app);
    console.log("slected app is "+app.name);
    navigate(`/automation/systems/runs`);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!runName.trim()) {
  //     showAlert("error", "Run name is required.");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   try {
  //     // Add your API call for starting a new test run here
  //     console.log({ runName, description });
  //     showAlert("success", "Test run created successfully.");
  //     setRunName("");
  //     setDescription("");
  //     setIsModalOpen(false);
  //   } catch (err) {
  //     showAlert("error", "Failed to start test run.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomAlert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Alert */}
      {isVisible && <CustomAlert type={alert.type} message={alert.message} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Automated Applications</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Activity className="w-4 h-4" />
          New Test Run
        </Button>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <BarChart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">System Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Owner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Last Run</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Technical Owner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => handleRowClick(app)}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.name}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.owningTeam}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.technicalOwner}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{getStatusBadge(app.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-700">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* {selectedRow && <TestRun selectedApp={selectedApp} />} */}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 space-y-6 max-w-lg mx-auto">
          <DialogTitle className="text-2xl font-bold">Configure Test Run</DialogTitle>
          <DialogDescription>
            Configure and start a new test run for your selected application.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Dropdown */}
              <div>
                <label htmlFor="application" className="block text-sm font-medium text-gray-700">
                  Select Application
                </label>
                <select
                  id="application"
                  value={selectedItem?.id || ""}
                  onChange={(e) => {
                    const appId = parseInt(e.target.value);
                    const app = applications.find((app) => app.id === appId);
                    setSelectedItem(app || null);
                  }}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select an application</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Environment Dropdown */}
              <div>
                <label htmlFor="environment" className="block text-sm font-medium text-gray-700">
                  Select Environment
                </label>
                <select
                  id="environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="SIT">SIT</option>
                  <option value="UAT">UAT</option>
                  <option value="PROD">PROD</option>
                </select>
              </div>
            </div>

            {/* Browser Selection */}
            <div>
              <label htmlFor="browser" className="block text-sm font-medium text-gray-700">
                Select Browser
              </label>
              <select
                id="browser"
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
                <option value="edge">Edge</option>
              </select>
            </div>

            {/* Robot Framework Arguments */}
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Dry Run</label>
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={() => setDryRun((prev) => !prev)}
                    className="ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Log Output</label>
                  <input
                    type="checkbox"
                    checked={log}
                    onChange={() => setLog((prev) => !prev)}
                    className="ml-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Report Output</label>
                  <input
                    type="checkbox"
                    checked={report}
                    onChange={() => setReport((prev) => !prev)}
                    className="ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Output File</label>
                  <input
                    type="checkbox"
                    checked={output}
                    onChange={() => setOutput((prev) => !prev)}
                    className="ml-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Include Tags</label>
                  <input
                    type="checkbox"
                    checked={includeTags}
                    onChange={() => setIncludeTags((prev) => !prev)}
                    className="ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Exclude Tags</label>
                  <input
                    type="checkbox"
                    checked={excludeTags}
                    onChange={() => setExcludeTags((prev) => !prev)}
                    className="ml-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Capture Screenshot</label>
                  <input
                    type="checkbox"
                    checked={captureScreenshot}
                    onChange={() => setCaptureScreenshot((prev) => !prev)}
                    className="ml-2"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700">Enable Video Recording</label>
                  <input
                    type="checkbox"
                    checked={videoRecording}
                    onChange={() => setVideoRecording((prev) => !prev)}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Start Test Run"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsDashboard;
