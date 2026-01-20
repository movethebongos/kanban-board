import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
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
      <textarea
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm resize-none
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
