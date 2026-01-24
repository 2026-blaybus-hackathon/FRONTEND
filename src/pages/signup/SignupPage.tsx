import { useState } from "react";
import InputForm from "../../components/common/form/InputForm";
import { validateEmail } from "../../libs/validation/email";
import { validatePassword, validatePasswordConfirm } from "../../libs/validation/password";
import Button from "../../components/common/button/Button";

const SignupPage = () => {
    const [email, setEmail] = useState({ value: "", error: "", success: "" });
    const [code, setCode] = useState({ value: "", error: "", success: "" });
    const [password, setPassword] = useState({ value: "", error: "", success: "" });
    const [passwordConfirm, setPasswordConfirm] = useState({ value: "", error: "", success: "" });
    const [nickname, setNickname] = useState({ value: "", error: "", success: "" });

    const [emailOver, setEmailOver] = useState(false);
    const [codeOver, setCodeOver] = useState(false);

    // onClick 함수
    const sendEmail = () => {
        console.log('send email')
        setEmailOver(true);
        setEmail(prev => ({ ...prev, success: "코드가 보내졌습니다. 이메일을 확인해주세요." }))
    }

    const validateCode = () => {
        console.log('validate code')
        setCodeOver(true);
        setCode(prev => ({ ...prev, success: "인증되었습니다."}))
    }

    // onChange 함수
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        const validation = validateEmail(emailValue);
        setEmail({ value: emailValue, ...validation });
        setEmailOver(false);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(prev => ({ ...prev, value: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = e.target.value;
        const validation = validatePassword(passwordValue);
        setPassword({ value: passwordValue, ...validation });
        if (passwordConfirm) {
            const validation = validatePasswordConfirm(passwordConfirm.value, passwordValue);
            setPasswordConfirm(prev => ({...prev, ...validation }));
        }
    };

    const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordConfirmValue = e.target.value;
        const validation = validatePasswordConfirm(passwordConfirmValue, password.value);
        setPasswordConfirm({ value: passwordConfirmValue, ...validation });
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(prev => ({ ...prev, value: e.target.value }));
    };

    return (
        <div className="flex flex-col justify-center items-center w-100 m-auto">
            <h1 className="mb-4 w-full text-center">
                회원가입
            </h1>
            <div className="flex flex-col gap-2 w-full my-8">
                <InputForm
                    title={"이메일"} 
                    type={"email"} 
                    value={email.value} 
                    onChange={handleEmailChange} 
                    ariaLabel={"signup email"} 
                    error={email.error} 
                    success={email.success}
                    readOnly={emailOver}
                    button={{
                        text: "확인",
                        onClick: sendEmail,
                        variant: "primary",
                        disabled: email.value.length === 0 || !!email.error || emailOver
                    }}
                />
                <InputForm
                    title={"인증코드"} 
                    type={"text"} 
                    value={code.value} 
                    onChange={handleCodeChange} 
                    ariaLabel={"signup code"} 
                    error={code.error} 
                    success={code.success}
                    readOnly={codeOver}
                    button={{
                        text: "인증",
                        onClick: validateCode,
                        variant: "primary",
                        disabled: code.value.length === 0 || codeOver
                    }}
                />
                <InputForm
                    title={"비밀번호"} 
                    type={"password"} 
                    value={password.value} 
                    onChange={handlePasswordChange} 
                    ariaLabel={"signup password"} 
                    error={password.error} 
                    success={password.success}
                />
                <InputForm
                    title={"비밀번호 확인"} 
                    type={"password"} 
                    value={passwordConfirm.value} 
                    onChange={handlePasswordConfirmChange} 
                    ariaLabel={"signup password confirm"} 
                    error={passwordConfirm.error} 
                    success={passwordConfirm.success}
                />
                <InputForm
                    title={"닉네임"} 
                    type={"text"} 
                    value={nickname.value} 
                    onChange={handleNicknameChange} 
                    ariaLabel={"signup nickname"} 
                    error={nickname.error} 
                    success={nickname.success}
                />
            </div>
            <Button ariaLabel={"signup"} width="full">회원가입</Button>
        </div>
    );
};

export default SignupPage;