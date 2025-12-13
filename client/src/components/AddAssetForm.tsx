import React, { useState } from 'react';
import { Package } from 'lucide-react';
import Button from './Button';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';

interface FormValues {
  name: string;
  category: string;
  status: string;
  location: string;
  company: string;
}

interface FormErrors {
  name?: string;
  category?: string;
  status?: string;
  location?: string;
  company?: string;
}

interface AddAssetFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

const categoryOptions = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'property', label: 'Property' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const locationOptions = [
  { value: 'head_office', label: 'Head Office' },
  { value: 'branch_a', label: 'Branch A' },
  { value: 'branch_b', label: 'Branch B' },
  { value: 'warehouse', label: 'Warehouse' },
];

const companyOptions = [
  { value: 'cic_agri', label: 'CIC Agri Businesses' },
  { value: 'cic_holdings', label: 'CIC Holdings' },
  { value: 'cic_foods', label: 'CIC Foods' },
];

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onSubmit, onCancel }) => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    category: 'equipment',
    status: 'active',
    location: 'head_office',
    company: 'cic_agri',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.name.trim()) {
      newErrors.name = 'Asset name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      // Form successfully submitted
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle submission error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Package className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="font-medium text-slate-800">New Asset Details</h3>
          <p className="text-sm text-slate-500">Enter the information below to add a new asset</p>
        </div>
      </div>
      
      <FormField 
        label="Asset Name" 
        htmlFor="name" 
        required
        error={errors.name}
      >
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Enter asset name"
          error={!!errors.name}
          autoFocus
        />
      </FormField>
      
      <FormField 
        label="Category" 
        htmlFor="category"
      >
        <Select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          options={categoryOptions}
        />
      </FormField>
      
      <FormField 
        label="Status" 
        htmlFor="status"
      >
        <Select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="Location" 
          htmlFor="location"
        >
          <Select
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            options={locationOptions}
          />
        </FormField>
        
        <FormField 
          label="Company" 
          htmlFor="company"
        >
          <Select
            id="company"
            name="company"
            value={values.company}
            onChange={handleChange}
            options={companyOptions}
          />
        </FormField>
      </div>
      
      <div className="flex justify-end gap-3 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          isLoading={isSubmitting}
        >
          Add Asset
        </Button>
      </div>
    </form>
  );
};

export default AddAssetForm;