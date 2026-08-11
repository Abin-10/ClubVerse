import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`w-full bg-white text-slate-900 text-sm rounded-xl border px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 pt-0.5">{error}</p>
      )}
    </div>
  );
}
