import React, { useState, useEffect } from 'react';
import { X, Laptop, Edit } from 'lucide-react';
import Button from '../Button';
import InputField from '../InputField';

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

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSubmit: (deviceData: Device) => void;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ isOpen, onClose, device, onSubmit }) => {
  const [formData, setFormData] = useState<Device>({
    id: 0,
    name: '',
    type: '',
    status: 'active',
    assignedTo: '',
    location: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    warrantyExpiry: '',
    lastMaintenance: '',
    specifications: ''
  });

  const [errors, setErrors] = useState<Partial<Device>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (device) {
      setFormData(device);
    }
  }, [device]);

  const deviceTypes = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'printer', label: 'Printer' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'server', label: 'Server' },
    { value: 'other', label: 'Other' }
  ];

  const locations = [
    { value: 'head_office', label: 'Head Office' },
    { value: 'branch_a', label: 'Branch A' },
    { value: 'branch_b', label: 'Branch B' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'remote', label: 'Remote' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'retired', label: 'Retired' }
  ];

  const handleInputChange = (field: keyof Device, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Device> = {};

    if (!formData.name.trim()) newErrors.name = 'Device name is required';
    if (!formData.type) newErrors.type = 'Device type is required';
    if (!formData.location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error updating device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Edit className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Edit Device</h2>
              <p className="text-sm text-slate-600">Update device information</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Laptop size={20} className="text-purple-600" />
                  Basic Information
                </h3>
              </div>

              <InputField
                label="Device Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter device name"
                required
                error={errors.name}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select device type</option>
                  {deviceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <InputField
                label="Manufacturer"
                id="manufacturer"
                type="text"
                value={formData.manufacturer || ''}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="Enter manufacturer"
              />

              <InputField
                label="Model"
                id="model"
                type="text"
                value={formData.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter model"
              />

              <InputField
                label="Serial Number"
                id="serialNumber"
                type="text"
                value={formData.serialNumber || ''}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                placeholder="Enter serial number"
              />

              <InputField
                label="Assigned To"
                id="assignedTo"
                type="text"
                value={formData.assignedTo || ''}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Enter assigned user"
              />

              {/* Location & Status */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Laptop size={20} className="text-green-600" />
                  Location & Status
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select location</option>
                  {locations.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Laptop size={20} className="text-orange-600" />
                  Dates & Maintenance
                </h3>
              </div>

              <InputField
                label="Purchase Date"
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate || ''}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              />

              <InputField
                label="Warranty Expiry"
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry || ''}
                onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
              />

              <InputField
                label="Last Maintenance"
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance || ''}
                onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
              />

              {/* Specifications */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Specifications</label>
                <textarea
                  value={formData.specifications || ''}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder="Enter device specifications"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            className="min-w-[120px]"
          >
            Update Device
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceModal;