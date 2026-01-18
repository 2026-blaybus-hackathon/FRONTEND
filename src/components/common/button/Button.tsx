// Button.tsx
import React from 'react';
import { cn } from '../../../libs/utils';

export type ButtonVariant = "primary" | "outlined";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonWidth = "auto" | "full";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size? : ButtonSize;
    width?: ButtonWidth;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string; // 추가 디자인
    ariaLabel: string;
}

const Button = ({
    variant = "primary",
    size = "lg",
    width = "auto",
    children,
    onClick = () => {},
    disabled = false,
    isLoading = false,
    className = "",
    ariaLabel,
    ...props
}: ButtonProps) => {

    // variant 스타일 클래스
    const variantClasses: Record<ButtonVariant, string> = {
        "primary": "bg-primary hover:brightness-50 text-white border-transparent",
        "outlined": "bg-white hover:brightness-50 text-primary border-primary",
    }

    // disabled variant 스타일 클래스
    const disabledClasses: Record<ButtonVariant, string> = {
        "primary": "bg-gray-3 text-gray-1",
        "outlined": "bg-gray-1 text-gray-3 border-gray-3",
    }

    // size 스타일 클래스
    const sizeClasses: Record<ButtonSize, string> = {
        sm: "text-xs px-3 py-1.5 rounded",
        md: "text-sm px-4 py-2 rounded-md",
        lg: "text-base px-6 py-3 rounded-lg",
    }

    // width 스타일 클래스
    const widthClasses: Record<ButtonWidth, string> = {
        auto: "w-fit",
        full: "w-full",
    }

    return (
        <button
            className={cn(
                "border-2 font-medium transition-colors duration-200 whitespace-nowrap",
                variantClasses[variant],
                sizeClasses[size],
                widthClasses[width],
                disabled && disabledClasses[variant],
                className,
            )}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
