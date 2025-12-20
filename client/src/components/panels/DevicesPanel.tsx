import { useState } from 'react';
import { Laptop, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Button from '../Button';
import AddDeviceModal, { type DeviceFormData } from '../modals/AddDeviceModal';
import ViewDeviceModal from '../modals/ViewDeviceModal';
import EditDeviceModal from '../modals/EditDeviceModal';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  assignedTo?: string;
  location: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  specifications?: string;
}

const DevicesPanel = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      type: 'laptop',
      status: 'active',
      assignedTo: 'Punura Ramuditha',
      location: 'head_office',
      serialNumber: 'MBP123456',
      model: 'MacBook Pro 16-inch',
      manufacturer: 'Apple',
      purchaseDate: '2023-08-15',
      warrantyExpiry: '2026-08-15',
      lastMaintenance: '2024-01-10',
      specifications: 'M2 Pro chip, 16GB RAM, 512GB SSD, 16-inch Liquid Retina XDR display'
    },
    {
      id: 5,
      name: 'Dell UltraSharp 27"',
      type: 'monitor',
      status: 'active',
      assignedTo: 'Nilakshi Anuradha',
      location: 'branch_b',
      serialNumber: 'DU567890',
      model: 'UltraSharp U2723QE',
      manufacturer: 'Dell',
      purchaseDate: '2023-07-12',
      warrantyExpiry: '2026-07-12',
      specifications: '27-inch 4K USB-C Hub Monitor, IPS technology, 99% sRGB color coverage'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'laptop': return 'Laptop';
      case 'desktop': return 'Desktop';
      case 'tablet': return 'Tablet';
      case 'smartphone': return 'Smartphone';
      case 'printer': return 'Printer';
      case 'monitor': return 'Monitor';
      case 'server': return 'Server';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const getLocationLabel = (location: string): string => {
    switch (location) {
      case 'head_office': return 'Head Office';
      case 'branch_a': return 'Branch A';
      case 'branch_b': return 'Branch B';
      case 'warehouse': return 'Warehouse';
      case 'remote': return 'Remote';
      default: return location;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'retired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDeviceIcon = (_type: string) => {
    return <Laptop className="text-purple-600" size={24} />;
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTypeLabel(device.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocationLabel(device.location).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.assignedTo && device.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddDevice = (deviceData: DeviceFormData) => {
    const newDevice: Device = {
      id: Math.max(...devices.map(d => d.id), 0) + 1,
      ...deviceData
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(prev => prev.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
  };

  const handleDeleteDevice = (id: number) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      setDevices(prev => prev.filter(device => device.id !== id));
    }
  };

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsViewModalOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleEditFromView = (_device: Device) => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-slate-800">Devices</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search devices..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Device
        </Button>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Laptop className="text-slate-400" size={24} />
          </div>
          <h3 className="font-medium text-slate-800 mb-1">No Devices Found</h3>
          <p className="text-slate-500 mb-4">
            {searchQuery ? 'No devices match your search criteria' : 'Get started by adding your first device'}
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Device
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <div 
              key={device.id} 
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 truncate">{device.name}</h3>
                  <p className="text-sm text-slate-500">{getTypeLabel(device.type)}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Assigned To</span>
                  <span className="text-slate-800 font-medium text-right">
                    {device.assignedTo || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-800 font-medium text-right">
                    {getLocationLabel(device.location)}
                  </span>
                </div>
                {device.lastMaintenance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Maintenance</span>
                    <span className="text-slate-800 font-medium">
                      {new Date(device.lastMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => handleViewDevice(device)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={14} />
                  View
                </button>
                <button 
                  onClick={() => handleEditDevice(device)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteDevice(device.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDevice}
      />

      <ViewDeviceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        device={selectedDevice}
        onEdit={handleEditFromView}
      />

      <EditDeviceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        device={selectedDevice}
        onSubmit={handleUpdateDevice}
      />
    </div>
  );
};

export default DevicesPanel;