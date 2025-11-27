import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Fun, 3D-style buttons with thick bottom borders
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold text-lg transition-all transform active:scale-95 active:border-b-0 active:translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100";
  
  const variants = {
    // Bright Yellow/Orange for primary actions
    primary: "bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 hover:bg-yellow-300 focus:ring-yellow-400",
    // White with Sky Blue border for secondary
    secondary: "bg-white text-sky-600 border-2 border-sky-200 border-b-4 hover:bg-sky-50 focus:ring-sky-400",
    // Red/Pink for danger
    danger: "bg-rose-400 text-white border-b-4 border-rose-600 hover:bg-rose-500 focus:ring-rose-400",
    // Green for success/special
    success: "bg-green-400 text-green-900 border-b-4 border-green-600 hover:bg-green-300 focus:ring-green-400",
    // Simple ghost
    ghost: "text-sky-600 hover:bg-sky-100 hover:text-sky-700 border-b-4 border-transparent focus:ring-sky-400"
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyles} ${selectedVariant} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};