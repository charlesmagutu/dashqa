import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  PieChart,
  Plus,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const DeviceDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  interface Device {
    name: string,
    type: string,
    os: string,
    status: string,
    lastChekedOut: string | null,
    assignedTo: string,
  }
 //const [selectedItem, setSelectedItem] = useGenericContext<Device>();

 const navigate = useNavigate();
  // Sample data - would come from your backend
  const deviceStats = {
    total: 45,
    available: 28,
    inUse: 12,
    maintenance: 5,
    types: {
      mobile: 20,
      tablet: 15,
      laptop: 10
    }
  };

  const [devices] = useState([
    { id: 1, name: 'iPhone 13', type: 'Mobile', os: 'iOS 15', status: 'Available', lastCheckedOut: null, assignedTo: null },
    { id: 2, name: 'Samsung Galaxy S21', type: 'Mobile', os: 'Android 12', status: 'In Use', lastCheckedOut: '2024-12-14', assignedTo: 'John Doe' },
    { id: 3, name: 'iPad Pro', type: 'Tablet', os: 'iOS 15', status: 'Maintenance', lastCheckedOut: '2024-12-10', assignedTo: null },
    { id: 4, name: 'Macbook Pro', type: 'Laptop', os: 'macOS Monterey', status: 'Available', lastCheckedOut: '2024-12-01', assignedTo: null },
    { id: 5, name: 'Google Pixel 6', type: 'Mobile', os: 'Android 12', status: 'In Use', lastCheckedOut: '2024-12-13', assignedTo: 'Jane Smith' },
    { id: 6, name: 'Surface Pro', type: 'Tablet', os: 'Windows 11', status: 'Available', lastCheckedOut: '2024-12-05', assignedTo: null },
    { id: 7, name: 'iPhone 12', type: 'Mobile', os: 'iOS 15', status: 'Maintenance', lastCheckedOut: '2024-12-08', assignedTo: null },
  ]);

  const statusData = [
    { name: 'Available', value: deviceStats.available, color: '#22c55e' },
    { name: 'In Use', value: deviceStats.inUse, color: '#3b82f6' },
    { name: 'Maintenance', value: deviceStats.maintenance, color: '#eab308' }
  ];

  const utilizationData = [
    { month: 'Jan', devices: 35 },
    { month: 'Feb', devices: 42 },
    { month: 'Mar', devices: 38 },
    { month: 'Apr', devices: 45 },
    { month: 'May', devices: 40 },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-500';
      case 'in use': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(devices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevices = devices.slice(indexOfFirstItem, indexOfLastItem);

const manageDevice = (device: Device) =>{
  //selectedItem(device)
  navigate("/devices/manage")
}

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Gadgets</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Device
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{deviceStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{deviceStats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{deviceStats.inUse}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{deviceStats.maintenance}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Charts */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Device Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Device Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="devices" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List Table */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle>Device List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Checked Out</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.os}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(device.status)}`}>
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.lastCheckedOut || 'Never'}</TableCell>
                  <TableCell>{device.assignedTo || 'None'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {device.status === 'Available' && (
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {device.status === 'In Use' && (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={()=> manageDevice(device)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {/* <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, devices.length)} of {devices.length} devices
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDashboard;