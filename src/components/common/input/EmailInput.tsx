import Input, { type InputProps } from './Input';

type EmailInputProps = Omit<InputProps, "variant" | "inputMode" | "placeholder">

const EmailInput = (props: EmailInputProps) => {
    return (
        <Input
            variant="outlined"
            inputMode="email"
            placeholder="이메일을 입력해주세요."
            {...props}
        />
    )
}

export default EmailInput;