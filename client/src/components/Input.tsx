import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  error = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full px-3 py-2 bg-white border rounded-lg focus:outline-none
        ${error 
          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900 placeholder-red-300'
          : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400'
        }
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;