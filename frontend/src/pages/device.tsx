import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  Filter, 
  Calendar, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

// Sample comprehensive history data
const initialHistoryData = [
  {
    id: 'HIS001',
    deviceId: 'DEV001',
    deviceName: 'Macbook Pro',
    type: 'Checkout',
    from: {
      location: 'IT Department',
      assignedTo: 'John Doe',
      department: 'Engineering'
    },
    to: {
      location: 'Client Site',
      assignedTo: 'John Doe',
      department: 'Engineering'
    },
    timestamp: '2024-02-15T10:30:00Z',
    reason: 'Client Meeting',
    status: 'Approved',
    duration: '3 days'
  },
  {
    id: 'HIS002',
    deviceId: 'DEV002',
    deviceName: 'iPhone 13',
    type: 'Maintenance',
    from: {
      location: 'Sales Office',
      assignedTo: 'Sarah Smith',
      department: 'Sales'
    },
    to: {
      location: 'IT Repair Center',
      assignedTo: 'IT Support',
      department: 'IT'
    },
    timestamp: '2024-02-10T14:45:00Z',
    reason: 'Screen Repair',
    status: 'In Progress',
    duration: 'Ongoing'
  },
  // More history entries...
];

const DeviceHistoryTracker = () => {
  const [historyData, setHistoryData] = useState(initialHistoryData);
  const [filters, setFilters] = useState({
    type: '',
    department: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });
  const [expandedEntry, setExpandedEntry] = useState(null);

  // Advanced filtering and sorting
  const filteredAndSortedHistory = useMemo(() => {
    return historyData
      .filter(entry => {
        const matchesType = !filters.type || entry.type === filters.type;
        const matchesDepartment = 
          !filters.department || 
          entry.from.department === filters.department || 
          entry.to.department === filters.department;
        const matchesStatus = !filters.status || entry.status === filters.status;
        
        const entryDate = new Date(entry.timestamp);
        const matchesDateRange = 
          (!filters.dateRange.start || entryDate >= new Date(filters.dateRange.start)) &&
          (!filters.dateRange.end || entryDate <= new Date(filters.dateRange.end));

        return matchesType && matchesDepartment && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;
        if (a[sortConfig.key] < b[sortConfig.key]) return -1 * modifier;
        if (a[sortConfig.key] > b[sortConfig.key]) return 1 * modifier;
        return 0;
      });
  }, [historyData, filters, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleEntryExpand = (entryId) => {
    setExpandedEntry(prev => prev === entryId ? null : entryId);
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      'Approved': 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Clock className="mr-2" /> Device History Tracker
        </h1>
        
        {/* Filter Controls */}
        <div className="flex space-x-2">
          <select 
            value={filters.type}
            onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
            className="border rounded px-2 py-1"
          >
            <option value="">All Types</option>
            <option value="Checkout">Checkout</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
          </select>
          
          <div className="relative">
            <input 
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                dateRange: {...prev.dateRange, start: e.target.value}
              }))}
              className="border rounded px-2 py-1"
            />
            <input 
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                dateRange: {...prev.dateRange, end: e.target.value}
              }))}
              className="border rounded px-2 py-1 ml-2"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th 
                className="p-3 text-left cursor-pointer flex items-center"
                onClick={() => toggleSort('timestamp')}
              >
                Timestamp 
                {sortConfig.key === 'timestamp' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </th>
              <th className="p-3 text-left">Device</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">From</th>
              <th className="p-3 text-left">To</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHistory.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={16} />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">{entry.deviceName}</td>
                  <td className="p-3">{entry.type}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-blue-500" size={16} />
                      {entry.from.location}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <ArrowRight className="mr-2 text-green-500" size={16} />
                      {entry.to.location}
                    </div>
                  </td>
                  <td className="p-3">
                    {renderStatusBadge(entry.status)}
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => toggleEntryExpand(entry.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedEntry === entry.id ? 'Collapse' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expandedEntry === entry.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">From Details</h3>
                          <p>Location: {entry.from.location}</p>
                          <p>Assigned To: {entry.from.assignedTo}</p>
                          <p>Department: {entry.from.department}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">To Details</h3>
                          <p>Location: {entry.to.location}</p>
                          <p>Assigned To: {entry.to.assignedTo}</p>
                          <p>Department: {entry.to.department}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Additional Information</h3>
                          <p>Reason: {entry.reason}</p>
                          <p>Duration: {entry.duration}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedHistory.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No history entries found
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceHistoryTracker;