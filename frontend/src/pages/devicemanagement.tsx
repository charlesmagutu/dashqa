import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Users, 
  ArrowRightLeft, 
  Check, 
  X,
  Clock
} from 'lucide-react';

const DeviceManagementPage = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedNewUser, setSelectedNewUser] = useState(null);
  const [returnComment, setReturnComment] = useState('');
  const [deviceCondition, setDeviceCondition] = useState('Good');
  const [users, setUsers] = useState([]);
  const [loadingDevice, setLoadingDevice] = useState(true); // For loading device data
  const [loadingUsers, setLoadingUsers] = useState(true); // For loading users

  // Fetch device data from server (replace URL with your actual API endpoint)
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/device/1'); // Example endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch device data');
        }
        const data = await response.json();
        setSelectedDevice(data);
      } catch (error) {
        console.error('Error fetching device data:', error);
      } finally {
        setLoadingDevice(false);
      }
    };

    fetchDeviceData();
  }, []);

  // Fetch users to be assigned
  useEffect(() => {
    const fetchUsersToBeAssigned = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/user/all');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersToBeAssigned();
  }, []);

  const handleDeviceAssignment = async () => {
    if (selectedNewUser) {

      const historyEntry = {
        devicedId: selectedDevice._id,
        
      }
      setSelectedDevice(prev => ({
        ...prev,
        assignedTo: selectedNewUser.name,
        status: 'Assigned',
        deviceHistory: [
          {
            date: new Date().toISOString(),
            action: 'Assigned',
            user: selectedNewUser.name,
            status: 'Active'
          },
          ...prev.deviceHistory
        ]
      }));
      setAssignmentDialogOpen(false);
    }
  };

  const handleDeviceReturn = () => {
    setSelectedDevice(prev => ({
      ...prev,
      assignedTo: null,
      status: 'Available',
      deviceHistory: [
        {
          date: new Date().toISOString(),
          action: 'Returned',
          user: prev.assignedTo,
          status: 'Active',
          comment: returnComment,
          condition: deviceCondition
        },
        ...prev.deviceHistory
      ]
    }));
    setReturnDialogOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loadingDevice || loadingUsers) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {/* Device Image and Fixed Specifications */}
        <Card className="col-span-2 h-[600px] flex flex-col">
          <CardContent className="p-0 flex flex-1 overflow-hidden">
            {/* Device Image */}
            <div className="w-1/2 relative">
              <img 
                src={selectedDevice.image} 
                alt={selectedDevice.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                <h2 className="text-2xl font-bold">{selectedDevice.name}</h2>
                <p className="text-sm">{selectedDevice.serialNumber}</p>
              </div>
            </div>

            {/* Device Details */}
            <div className="w-1/2 p-6 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Device Specifications</h3>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${selectedDevice.status === 'Assigned' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'}
                    `}
                  >
                    {selectedDevice.status}
                  </span>
                </div>

                {Object.entries(selectedDevice.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}

                {/* Assignment Actions */}
                <div className="mt-6 space-y-4">
                  {selectedDevice.assignedTo ? (
                    <Dialog 
                      open={returnDialogOpen} 
                      onOpenChange={setReturnDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <ArrowRightLeft className="mr-2" /> Return Device
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Return Device</DialogTitle>
                          <DialogDescription>
                            Please provide details about the device return
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select 
                            onValueChange={setDeviceCondition}
                            defaultValue="Good"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Device Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Good">Good Condition</SelectItem>
                              <SelectItem value="Damaged">Damaged</SelectItem>
                              <SelectItem value="NeedsRepair">Needs Repair</SelectItem>
                            </SelectContent>
                          </Select>
                          <Textarea
                            placeholder="Additional comments about device return"
                            value={returnComment}
                            onChange={(e) => setReturnComment(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeviceReturn}
                          >
                            Confirm Return
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog 
                      open={assignmentDialogOpen} 
                      onOpenChange={setAssignmentDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="default" className="w-full">
                          <Users className="mr-2" /> Assign Device
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Device</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select onValueChange={(value) => 
                            setSelectedNewUser(
                              users.find(u => u.id === value)
                            )
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} - {user.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            onClick={handleDeviceAssignment} 
                            disabled={!selectedNewUser}
                            className="w-full"
                          >
                            Confirm Assignment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device History with Separators */}
        <Card className="h-[600px] flex flex-col">
  <CardHeader>
    <CardTitle className="flex items-center">
      <Clock className="mr-2 text-gray-500" />
      Device History
    </CardTitle>
  </CardHeader>
  <CardContent className="flex-1 overflow-y-auto">
    <div className="space-y-4">
      {selectedDevice.deviceHistory.map((entry, index) => (
        <div key={index} className="relative">
          {/* Timeline Separator */}
          <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gray-200">
            <div className="absolute top-0 -left-1.5 w-3 h-3 bg-gray-200 rounded-full"></div>
          </div>

          {/* History Entry */}
          <div className="pl-6 pb-4 relative">
            <div className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">{entry.action}</span>
                  <span
                    className={`
                      px-2 py-1 rounded-full text-xs
                      ${entry.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    `}
                  >
                    {entry.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(entry.date)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">User:</span> {entry.user}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Comments:</span> {entry.comment || 'No comments provided'}
              </p>
              {entry.condition && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Condition:</span> {entry.condition}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default DeviceManagementPage;
