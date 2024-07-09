import { Link, Button as NextUIButton } from '@nextui-org/react';
import React from 'react';
import './button.css';

export interface ButtonProps {
  children?: React.ReactNode;
  href?: string;
  color?:
    | 'primary'
    | 'secondary'
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dark'
    | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isExternal?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  ariaLabel?: string;
  variant?: 'solid' | 'bordered';
}
const Button: React.FC<ButtonProps> = ({
  children,
  href,
  color = 'primary',
  size = 'md',
  onClick,
  isExternal = false,
  isLoading = false,
  isDisabled = false,
  isIconOnly = false,
  ariaLabel,
  variant = 'solid'
}) => {
  // const computedVariant = (color === 'secondary') ? 'bordered' : variant || 'solid';
  const buttonClasses =
    color === 'primary' && variant === 'solid' ? 'btn-primary'
    : color === 'dark' && variant === 'solid' ? 'btn-dark'
    : color === 'secondary' && variant === 'solid' ? 'btn-secondary'
    : color === 'primary' && variant === 'bordered' ? 'btn-outline-primary'
    : color === 'dark' && variant === 'bordered' ? 'btn-outline-dark'
    : color === 'secondary' && variant === 'bordered' ? 'btn-outline-secondary'
    : '';
  const componentProps =
    href ?
      {
        as: Link,
        href,
        target: isExternal ? '_blank' : undefined,
        rel: isExternal ? 'noopener noreferrer' : undefined
      }
    : {};

  const ariaProps = isIconOnly && ariaLabel ? { 'aria-label': ariaLabel } : {};

  return (
    <NextUIButton
      className={`${buttonClasses} font-bold`}
      radius="full"
      variant={variant}
      // color={color}
      size={size}
      onClick={onClick}
      disabled={isLoading || isDisabled}
      isLoading={isLoading}
      isIconOnly={isIconOnly}
      {...componentProps}
      {...ariaProps}
    >
      {children}
    </NextUIButton>
  );
};

export default Button;
