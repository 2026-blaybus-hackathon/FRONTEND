import { cn } from "../../../libs/utils";

export type InputVariant = "outlined";
export type InputSize = "md";
export type InputWidth = number | "full";

export interface InputProps {
    variant?: InputVariant;
    size?: InputSize;
    width?: InputWidth;
    inputMode?: "text" | "numeric" | "email" | "password";
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    isError?: boolean;
    className?: string;
    ariaLabel: string;
}

const Input = ({
    variant = "outlined",
    size = "md",
    width = 312,
    inputMode = "text",
    value,
    onChange,
    onKeyDown,
    placeholder = "",
    readOnly = false,
    isError = false,
    className,
    ariaLabel
}: InputProps) => {
    // variant 스타일 클래스
    const variantClasses: Record<InputVariant, string> = {
        "outlined": "text-gray-5 border-2 border-gray-3 bg-white"
    }

    // variant focus 스타일 클래스
    const variantFocusClasses: Record<InputVariant, string> = {
        "outlined": "focus:border-primary"
    }

    // size 스타일 클래스
    const sizeClasses: Record<InputSize, string> = {
        md: "text-base font-light px-4 py-3 rounded-md",
    }

    // width 스타일 클래스
    const widthClass = width === "full" ? "w-full" : `w-[${width}px]`
  
    return (
        <input
            type={inputMode}
            className={cn(
                "focus: outline-none font-medium transition-colors duration-200 whitespace-nowrap",
                variantClasses[variant],
                sizeClasses[size],
                widthClass,
                isError && "border-error",
                readOnly ?
                    "bg-gray-1 border-gray-3 text-gray-3" :
                    variantFocusClasses[variant],
                className
            )}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
                if (onKeyDown && e.key === "Enter") onKeyDown(e)
            }}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-label={ariaLabel}
        />
    )
}

export default Input;