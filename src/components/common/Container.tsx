import React from 'react';
import { cn } from '../../libs/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Container component for consistent max-width and responsive padding
 * 
 * Features:
 * - Max-width with center alignment
 * - Responsive padding (mobile: 16px, tablet: 24px, desktop: 32px)
 * - Customizable HTML element via 'as' prop
 * - Additional className support
 */
export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className,
  as: Component = 'div' 
}) => {
  return (
    <Component className={cn('container', className)}>
      {children}
    </Component>
  );
};

export default Container;