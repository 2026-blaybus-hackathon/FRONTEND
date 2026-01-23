import DefaultInput from '../input/Input';
import EmailInput from "../input/EmailInput";
import PasswordInput from "../input/PasswordInput";

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
}

// type에 따른 Input 컴포넌트 결정
const Input = ({ type, error, ...rest }: Omit<InputFormProps, "title" | "success">) => {
    const inputProps = { ...rest, isError: !!error }
    if (type === "email")
        return <EmailInput {...inputProps} />;
    if (type === "password")
        return <PasswordInput {...inputProps} />;
    return <DefaultInput {...inputProps} />;
}

const InputForm = ({
    title,
    type,
    value,
    onChange,
    ariaLabel,
    error,
    success,
    readOnly = false }: InputFormProps) => {
    const inputProps = {
        type, value, onChange, error, readOnly,
        ariaLabel: ariaLabel + " input",
    }
    return (
        <div className="relative pb-5.5">
            <h3 className="text-gray-4 mb-2">{title}</h3>
            <Input {...inputProps} />
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