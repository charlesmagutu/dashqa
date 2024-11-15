import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, PlayCircle, RefreshCcw, Search, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";

interface ApplicationDetailsProps {}

const Automation : React.FC<ApplicationDetailsProps> = () => {

  const {id} = useParams();
  const navigate  = useNavigate();
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [suiteFilter, setSuiteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [runId, setRunId] = useState("");
  const [runs, setRuns] = useState([]);


  const getRuns = useCallback(async() =>{
    try{
      setLoading(true);
      setError(null);

      const url = "http://localhost:8081/api/v1/test";

      const allRuns = await fetch(url);
      if(!allRuns.ok){
        throw new Error(`HTTP error! status: ${allRuns.status}`);
      }

      const availableRuns = await allRuns.json();
      setRuns(availableRuns);
    }catch(err){

      setError(err.message || "unknown error occured");
      
    }finally{
      setLoading(false);
    }
  }, []);


  useEffect(()=>{
    getRuns();
  },[getRuns]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Modify fetch URL to include runId if specified
      const url = runId
        ? `http://localhost:8081/api/v1/test/${runId}`
        : "http://localhost:8081/api/v1/test";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    fetchData();
  }, [runId, fetchData]);

  const stats = useMemo(() => {
    if (!data.length)
      return {
        total: 0,
        passed: 0,
        failed: 0,
        passRate: "0.0",
        avgDuration: "0.00",
        suites: [],
      };

    const total = data.length;
    const passed = data.filter((row) => row.status === "PASS").length;
    const failed = data.filter((row) => row.status === "FAIL").length;
    const avgDuration = data.reduce((acc, row) => acc + row.duration, 0) / total;
    const suites = [...new Set(data.map((row) => row.suite))];

    return {
      total,
      passed,
      failed,
      passRate: ((passed / total) * 100).toFixed(1),
      avgDuration: avgDuration.toFixed(2),
      suites,
    };
  }, [data]);

  // Sorting function (by date for most recent first)
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      // Assuming `runDate` is the field that stores the date of the run
      const dateA = new Date(a.runDate);
      const dateB = new Date(b.runDate);

      return dateB - dateA; // Descending order, latest run first
    });

    return sorted;
  }, [data]);

  // Filtering function
  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      const matchesText =
        row.name.toLowerCase().includes(filterText.toLowerCase()) ||
        row.message.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesSuite = suiteFilter === "all" || row.suite === suiteFilter;
      return matchesText && matchesStatus && matchesSuite;
    });
  }, [sortedData, filterText, statusFilter, suiteFilter]);

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDuration = (duration) => duration.toFixed(2) + "s";
  const formatDateTime = (datetime) => new Date(datetime).toLocaleString();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCcw className="w-6 h-6 animate-spin" />
            <p>Loading test automation results from backend...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading test results: {error}
              <button
                onClick={fetchData}
                className="ml-4 text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const latestRun = data[0]; // The most recent run after sorting

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Test Execution Results</CardTitle>
          <div className="flex space-x-4">
            <button
              onClick={fetchData}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              title="Refresh data"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Run Tests
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </button>
          </div>
        </div>

        {/* Latest Run ID */}
        {latestRun && (
          <div className="bg-blue-100 p-2 rounded-lg text-sm text-blue-800 mt-2">
            <strong>Latest Run ID:</strong> {latestRun.id}
          </div>
        )}

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Tests</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Passed</p>
            <p className="text-2xl font-bold">{stats.passed} ({stats.passRate}%)</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Failed</p>
            <p className="text-2xl font-bold">{stats.failed}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Avg Duration</p>
            <p className="text-2xl font-bold">{stats.avgDuration}s</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tests..."
                className="pl-8"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          {/* Dropdowns for Status and Suite Filters */}
          <select
            className="border rounded-md p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PASS">Pass</option>
            <option value="FAIL">Fail</option>
          </select>
          <select
            className="border rounded-md p-2"
            value={suiteFilter}
            onChange={(e) => setSuiteFilter(e.target.value)}
          >
            <option value="all">All Suites</option>
            {stats.suites.map((suite) => (
              <option key={suite} value={suite}>
                {suite}
              </option>
            ))}
          </select>

          {/* New Dropdown for Run ID */}
          <select
            className="border rounded-md p-2"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            <option value="">Select Run</option>
            <option value="20241107-124105">20241107-124105</option>
            <option value="run2">Run 2</option>
            <option value="run3">Run 3</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Expand</th>
                {[
                  { key: "id", label: "ID" },
                  { key: "name", label: "Name" },
                  { key: "duration", label: "Duration" },
                  { key: "status", label: "Status" },
                  { key: "suite", label: "Suite" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="p-2 text-left border cursor-pointer hover:bg-gray-200"
                    onClick={() => toggleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortConfig.key === key ? (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            sortConfig.direction === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      ) : (
                        <ChevronDown className="h-4 w-4 opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className={`border hover:bg-gray-50 ${
                      row.status === "FAIL" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="p-2 border">
                      <button
                        onClick={() => toggleRow(row.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedRows.has(row.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-2 border">{row.id}</td>
                    <td className="p-2 border">{row.name}</td>
                    <td className="p-2 border">{formatDuration(row.duration)}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          row.status === "PASS"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-2 border">{row.suite}</td>
                  </tr>
                  {expandedRows.has(row.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4 border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-2">Timing Details</h4>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium">Start:</span> {formatDateTime(row.start_time)}
                              </p>
                              <p>
                                <span className="font-medium">End:</span> {formatDateTime(row.end_time)}
                              </p>
                              <p>
                                <span className="font-medium">Duration:</span> {formatDuration(row.duration)}
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-2">Test Details</h4>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium">Critical:</span> {row.critical}
                              </p>
                              <p>
                                <span className="font-medium">Type:</span> {row.type}
                              </p>
                              <p>
                                <span className="font-medium">Suite:</span> {row.suite}
                              </p>
                            </div>
                          </div>
                          {row.message && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold mb-2">Error Details</h4>
                              <p className="text-red-600 break-words">{row.message}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Automation;
