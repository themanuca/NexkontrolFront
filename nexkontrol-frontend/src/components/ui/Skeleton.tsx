import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'md' 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const style = {
    width: width || '100%',
    height: height || '1rem'
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} height="1rem" />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton width="40%" height="1rem" />
      <Skeleton width="20%" height="1rem" />
    </div>
    <Skeleton width="60%" height="2rem" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse ${className}`}>
    <Skeleton width="30%" height="1.5rem" className="mb-4" />
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton width="20%" height="1rem" />
          <Skeleton width="35%" height="1rem" />
          <Skeleton width="25%" height="1rem" />
          <Skeleton width="15%" height="1rem" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton; 