import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className = '', 
  ...props 
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md focus:ring-blue-500',
    secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md focus:ring-emerald-500',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
    subtle: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 focus:ring-blue-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
}
