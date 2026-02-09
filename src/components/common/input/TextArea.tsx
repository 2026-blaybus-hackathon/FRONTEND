import { cn } from "../../../libs/utils";

export type TextAreaVariant = "outlined" | "filled";
export type TextAreaSize = "md" | "lg";

export interface TextAreaProps {
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  width?: number | "full";
  height?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  isError?: boolean;
  className?: string;
  ariaLabel: string;
  maxLength?: number;
  rows?: number;
}

const TextArea = ({
  variant = "filled",
//   size = "md",
  width = "full",
  height,
  value,
  onChange,
  placeholder = "",
  readOnly = false,
  isError = false,
  className,
  ariaLabel,
  maxLength,
  rows = 4,
}: TextAreaProps) => {
  // variant 스타일 클래스
  const variantClasses: Record<TextAreaVariant, string> = {
    outlined: "text-gray-700 border-2 border-gray-300 bg-white",
    filled: "text-gray-700 border-none bg-gray-50",
  };

  // width 스타일 클래스
  const widthClass = width === "full" ? "w-full" : `w-[${width}px]`;

  // height 스타일 클래스
  const heightClass = height ? `h-[${height}px]` : "";

  return (
    <textarea
      className={cn(
        "outline-none rounded-200 focus:outline-none transition-colors duration-200 resize-none body-3 px-200 py-300",
        variantClasses[variant],
        widthClass,
        heightClass,
        isError && "border-red-500",
        readOnly && "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed",
        className
      )}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      aria-label={ariaLabel}
      maxLength={maxLength}
      rows={rows}
      style={{ resize: 'none' }}
    />
  );
};

export default TextArea;