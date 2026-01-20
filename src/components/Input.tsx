import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary-dark mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          ${error ? 'border-accent-pink' : 'border-accent-teal'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-accent-pink">{error}</p>
      )}
    </div>
  );
};
