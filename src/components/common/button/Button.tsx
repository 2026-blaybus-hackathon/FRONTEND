// Button.tsx
import React from 'react';
import { cn } from '../../../libs/utils';

export type ButtonVariant = "primary" | "secondary" | "outlined" | "ghost" | "gray";
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
    size = "md",
    width = "auto",
    children,
    onClick = () => {},
    disabled = false,
    isLoading = false,
    className = "",
    ariaLabel,
    ...props
}: ButtonProps) => {

    // 우리의 디자인 토큰 시스템 사용
    const variantClasses: Record<ButtonVariant, string> = {
        "primary": "btn btn-primary",
        "secondary": "btn btn-secondary",
        "outlined": "btn btn-outlined",
        "ghost": "btn btn-ghost",
        "gray": "btn btn-gray",
    }

    // size 스타일 클래스 (디자인 토큰 시스템과 통합)
    const sizeClasses: Record<ButtonSize, string> = {
        sm: "btn-sm",
        md: "",  // 기본 btn 크기 사용
        lg: "btn-lg",
    }

    // width 스타일 클래스
    const widthClasses: Record<ButtonWidth, string> = {
        auto: "w-fit",
        full: "w-full",
    }

    return (
        <button
            className={cn(
                "font-weight-500",
                variantClasses[variant],
                sizeClasses[size],
                widthClasses[width],
                className
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
