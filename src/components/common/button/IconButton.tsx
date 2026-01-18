// Button.tsx
import React from 'react';
import { cn } from '../../../libs/utils';
import type { LucideIcon } from 'lucide-react';

type IconButtonVariant = "transparent-gray" | "transparent-primary"
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
    variant = "transparent-gray",
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
        "transparent-gray": "border-transparent text-gray-3 bg-transparent hover:bg-gray-1",
        "transparent-primary": "border-transparent text-primary bg-transparent hover:bg-primary-light",
    }

    // disabled variant 스타일 클래스
    const disabledClasses: Record<IconButtonVariant, string> = {
        "transparent-gray": "border-transparent text-gray-2 bg-transparent hover:bg-transparent",
        "transparent-primary": "border-transparent text-gray-2 bg-transparent hover:bg-transparent",
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
                disabled && disabledClasses[variant],
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
