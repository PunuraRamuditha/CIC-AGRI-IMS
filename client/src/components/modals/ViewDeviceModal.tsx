import React from 'react';
import { X, Laptop, Calendar, User,  Settings } from 'lucide-react';
import Button from '../Button';

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

interface ViewDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onEdit: (device: Device) => void;
}

const ViewDeviceModal: React.FC<ViewDeviceModalProps> = ({ isOpen, onClose, device, onEdit }) => {
  if (!isOpen || !device) return null;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'retired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Laptop className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{device.name}</h2>
              <p className="text-sm text-slate-600">Device Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(device.status)}`}>
                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Laptop size={20} className="text-purple-600" />
                  Basic Information
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Device Name:</span>
                    <span className="font-medium text-slate-800">{device.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-800">{device.type}</span>
                  </div>
                  {device.manufacturer && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Manufacturer:</span>
                      <span className="font-medium text-slate-800">{device.manufacturer}</span>
                    </div>
                  )}
                  {device.model && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Model:</span>
                      <span className="font-medium text-slate-800">{device.model}</span>
                    </div>
                  )}
                  {device.serialNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Serial Number:</span>
                      <span className="font-medium text-slate-800">{device.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment & Location */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-600" />
                  Assignment & Location
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assigned To:</span>
                    <span className="font-medium text-slate-800">{device.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-medium text-slate-800">{device.location}</span>
                  </div>
                </div>
              </div>

              {/* Dates & Maintenance */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-orange-600" />
                  Dates & Maintenance
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Purchase Date:</span>
                    <span className="font-medium text-slate-800">{formatDate(device.purchaseDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Warranty Expiry:</span>
                    <span className="font-medium text-slate-800">{formatDate(device.warrantyExpiry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Maintenance:</span>
                    <span className="font-medium text-slate-800">{formatDate(device.lastMaintenance)}</span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {device.specifications && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-blue-600" />
                    Specifications
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-800">{device.specifications}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => onEdit(device)}
          >
            Edit Device
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeviceModal;