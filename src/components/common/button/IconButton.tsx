// Button.tsx
import React from 'react';
import { cn } from '../../../libs/utils';
import type { LucideIcon } from 'lucide-react';

type IconButtonVariant = "primary"
type IconButtonSize = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Icon: LucideIcon;
    variant?: IconButtonVariant;
    size? : IconButtonSize;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string; // 추가 디자인
    ariaLabel: string;
}

const IconButton = ({
    Icon,
    variant = "primary",
    size = "md",
    onClick = () => {},
    disabled = false,
    isLoading = false,
    className = "",
    ariaLabel,
    ...props
}: ButtonProps) => {

    // variant 스타일 클래스
    const variantClasses: Record<IconButtonVariant, string> = {
        "primary": "text-white bg-primary",
    }

    const hoverClasses: Record<IconButtonVariant, string> = {
        "primary": "hover:bg-primary-light",
    }

    // disabled variant 스타일 클래스
    const disabledClasses: Record<IconButtonVariant, string> = {
        "primary": "border-transparent text-white bg-gray-200 hover:bg-gray-200 cursor-not-allowed",
    }

    // size pixel
    const sizePixel: Record<IconButtonSize, number> = {
        md: 36,
        sm: 24
    }

    // size 스타일 클래스
    const sizeClasses: Record<IconButtonSize, string> = {
        md: "p-3 rounded-full",
        sm: "p-1 rounded-full"
    }

    return (
        <button
            className={cn(
                "border-2 font-medium transition-colors duration-200 whitespace-nowrap w-fit h-fit",
                variantClasses[variant],
                sizeClasses[size],
                disabled ? disabledClasses[variant] : hoverClasses[variant],
                className,
            )}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-label={ariaLabel}
            {...props}
        >
            <Icon size={sizePixel[size]} />
        </button>
    );
};

export default IconButton;
