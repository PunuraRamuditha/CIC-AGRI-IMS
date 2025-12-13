import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`
          appearance-none w-full px-3 py-2 bg-white border rounded-lg focus:outline-none pr-10
          ${error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900'
            : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900'
          }
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown size={16} className="text-slate-400" />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;