import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonVariant, ButtonSize } from '@/types/common';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-carrot-orange text-white hover:bg-orange-600 focus:ring-carrot-orange',
        secondary: 'bg-gray-100 text-heavy-metal hover:bg-gray-200 focus:ring-gray-500',
        outline: 'border border-carrot-orange text-carrot-orange hover:bg-carrot-orange hover:text-white focus:ring-carrot-orange',
        ghost: 'text-carrot-orange hover:bg-carrot-orange/10 focus:ring-carrot-orange',
        link: 'text-carrot-orange underline-offset-4 hover:underline focus:ring-carrot-orange'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-8 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={`${buttonVariants({ variant, size })} ${className || ''}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
