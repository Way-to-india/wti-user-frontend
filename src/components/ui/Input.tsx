import React from 'react';
import { InputSize } from '@/types/common';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getSizeClasses = (size: InputSize = 'md') => {
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-4 text-base'
  };
  return sizes[size];
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    size = 'md', 
    leftIcon, 
    rightIcon, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const sizeClasses = getSizeClasses(size);
    const hasError = !!error;
    
    const inputClasses = [
      'w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-carrot-orange/20 focus:border-carrot-orange',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : 'border-gray-300',
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
      sizeClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
