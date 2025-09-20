import React from 'react';
import { BaseProps, CardVariant } from '@/types/common';

export interface CardProps extends BaseProps {
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const getVariantClasses = (variant: CardVariant = 'default') => {
  const variants = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100'
  };
  return variants[variant];
};

const getPaddingClasses = (padding: string = 'md') => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  return paddings[padding as keyof typeof paddings];
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';
  const variantClasses = getVariantClasses(variant);
  const paddingClasses = getPaddingClasses(padding);
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses,
    paddingClasses,
    hoverClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
