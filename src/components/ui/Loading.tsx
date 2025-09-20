import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  return sizes[size as keyof typeof sizes];
};

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = getSizeClasses(size);
  
  const spinner = (
    <div className={`${sizeClasses} border-4 border-gray-200 border-t-carrot-orange rounded-full animate-spin ${className}`} />
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
