import { Search } from "lucide-react";
import { cn } from "../../../libs/utils";

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onEnter?: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "검색",
  onEnter,
  className,
  ariaLabel = "검색",
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.(value.trim());
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 h-10 rounded-[20px] bg-white",
        "text-gray-700 px-4 py-2",
        "border-2 border-transparent focus-within:border-primary-400",
        "transition-colors duration-200",
        className
      )}
    >
      <Search
        className="shrink-0 text-gray-500"
        size={20}
        strokeWidth={2}
        aria-hidden
      />
      <input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        minLength={1}
        maxLength={10}
        className={cn(
          "flex-1 min-w-0 bg-transparent border-0 outline-none",
          "text-base font-normal",
          "placeholder:text-gray-500",
          "[&::placeholder]:font-normal"
        )}
      />
    </div>
  );
};

export default SearchInput;
