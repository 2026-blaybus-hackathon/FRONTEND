import DefaultInput from '../input/Input';
import EmailInput from "../input/EmailInput";
import PasswordInput from "../input/PasswordInput";
import Button from '../button/Button';

type InputType = "text" | "email" | "password";

interface InputFormProps {
    title: string;
    type: InputType;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    ariaLabel: string;
    error: string;
    success: string;
    readOnly?: boolean;
    button?: {
        text: string;
        onClick: () => void;
        variant?: "primary" | "outlined";
        disabled?: boolean;
    };
}

// type에 따른 Input 컴포넌트 결정
const Input = ({ type, error, ...rest }: Omit<InputFormProps, "title" | "success">) => {
    const inputProps = { ...rest, isError: !!error }
    if (type === "email")
        return <EmailInput {...inputProps} width={"full"} />;
    if (type === "password")
        return <PasswordInput {...inputProps} width={"full"} />;
    return <DefaultInput {...inputProps} width={"full"} />;
}

const InputForm = ({
    title,
    type,
    value,
    onChange,
    ariaLabel,
    error,
    success,
    readOnly = false,
    button }: InputFormProps) => {
    const inputProps = {
        type, value, onChange, error, readOnly,
        ariaLabel: ariaLabel + " input",
    }
    return (
        <div className="relative pb-5.5 w-full">
            <h3 className="text-gray-4 mb-2">{title}</h3>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input {...inputProps} />
                </div>
                {
                    button &&
                    <div className="flex items-end">
                        <Button 
                            variant={button.variant || "primary"}
                            width="auto"
                            onClick={button.onClick}
                            ariaLabel={button.text}
                            className="px-3.5"
                            disabled={button.disabled}
                        >
                            {button.text}
                        </Button>
                    </div>
                }
            </div>
            {
                error && !success &&
                <p className="absolute left-2 bottom-0 caption text-error">{error}</p>
            }
            {
                !error && success &&
                <p className="absolute left-2 bottom-0 caption text-success">{success}</p>
            }
        </div>
    );
};

export default InputForm;