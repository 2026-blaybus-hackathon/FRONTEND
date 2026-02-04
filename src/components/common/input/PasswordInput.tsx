import { useState } from 'react';
import Input, { type InputProps } from './Input';
import { cn } from '../../../libs/utils';
import { Eye, EyeOff } from 'lucide-react';
import IconButton from '../button/IconButton';

type PasswordInputProps = Omit<InputProps, "variant" | "inputMode" | "placeholder">

const PasswordInput = (props: PasswordInputProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    const toggleVisible = () => {
        setVisible(prev => !prev);
    }

    return (
        <div className="relative h-fit">
            <Input
                variant="outlined"
                inputMode={visible ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                className={cn(props.className, "pr-12")}
                {...props}
            />
            <div className="absolute h-full flex flex-column items-center bottom-0 right-2 w-fit h-fit">
                <IconButton
                    variant="gray-line"
                    Icon={visible ? Eye : EyeOff}
                    size="sm"
                    ariaLabel={visible ? "passwordVisible" : "passwordInvisible"}
                    onClick={toggleVisible}
                />
            </div>
        </div>
    )
}

export default PasswordInput;