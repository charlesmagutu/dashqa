import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CheckCircle, Clock2Icon, PlayCircle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGenericContext } from '@/GenericContex';

// Define the shape of each test run
interface TestRun {
  id: number;
  runId: string;
  runDate: string;
  createdAt: string;
  endedAt: string | null;
  triggeredBy: string;
  status: string;
}

// Define the selected app type
interface SelectedApp {
  name: string;
}

const formatDate = (date: string | number | Date) => new Date(date).toLocaleString();

const TestRunDashboard = () => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(5);
  //const { selectedItem } = useGenericContext();
  const navigate = useNavigate();
  const {setSelectedItem, selectedItem} = useGenericContext();
  const fetchTestRuns = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/test/run');
      const data = await response.json();
      setTestRuns(data);
    } catch (error) {
      console.error('Error fetching test runs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestRuns();
  }, []);

  const filteredTestRuns = testRuns
    .filter((run) => {
      if (filterStatus && !run.status.toLowerCase().includes(filterStatus.toLowerCase())) return false;
      if (startDate && new Date(run.runDate) < new Date(startDate)) return false;
      if (endDate && new Date(run.runDate) > new Date(endDate)) return false;
      return true;
    })
    .slice((page - 1) * perPage, page * perPage);

  const prepareTrendData = () => {
    return testRuns.map((run) => ({
      date: formatDate(run.runDate),
      Success: run.status === 'Passed' ? 1 : 0,
      Failure: run.status === 'Failed' ? 1 : 0
    }));
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setPage((prevPage) => {
      if (direction === 'next' && filteredTestRuns.length === perPage) {
        return prevPage + 1;
      } else if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const getStatusIcon = (run_status: string) => {
    switch (run_status) {
      case 'ENDED':
        return { icon: <CheckCircle color="green" />, color: 'text-green-500' };
      case 'RUNNING':
        return { icon: <Clock2Icon color="blue" />, color: 'text-blue-500' };
      case 'STARTED':
        return { icon: <PlayCircle color="orange" />, color: 'text-orange-500' };
      default:
        return { icon: null, color: '' };
    }
  };

  const onRowClick = (run: TestRun) => {
    setSelectedItem(run);
    navigate(`/automation/systems/runs/results`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedItem?.name ? `${selectedItem.name} Automated Test Runs` : 'Automated Test Runs'}</CardTitle>
          {/* Refresh Button */}
          <div className="mt-4">
            <Button onClick={fetchTestRuns}>Refresh Data</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Trend Graph */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Run Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Success" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Failure" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Test Runs Table */}
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Run Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Ended Time</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestRuns.map((run) => {
                    const { icon, color } = getStatusIcon(run.status);

                    return (
                      <TableRow
                        key={run.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => onRowClick(run)}
                      >
                        <TableCell>{run.runId}</TableCell>
                        <TableCell>{formatDate(run.runDate)}</TableCell>
                        <TableCell>{formatDate(run.createdAt)}</TableCell>
                        <TableCell>{run.endedAt ? formatDate(run.endedAt) : 'N/A'}</TableCell>
                        <TableCell>{run.triggeredBy}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${color}`}>
                            {icon}
                            <span>{run.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange('prev')}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {page}</span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange('next')}
                  disabled={filteredTestRuns.length < perPage}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRunDashboard;
