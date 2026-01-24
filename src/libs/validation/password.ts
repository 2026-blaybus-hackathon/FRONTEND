export interface ValidationResult {
    error: string;
    success: string;
}

const minLength = 8;

export const validatePassword = (passwordValue: string): ValidationResult => {
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
    
    if (passwordValue === "") {
        return { error: "", success: "" };
    } else if (passwordValue.length < minLength) {
        return { error: `비밀번호는 최소 ${minLength}자 이상이어야 합니다.`, success: "" };
    } else if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { error: "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.", success: "" };
    } else {
        return { error: "", success: "" };
    }
};

export const validatePasswordConfirm = (passwordConfirmValue: string, passwordValue: string): ValidationResult => {
    if (passwordConfirmValue === "") {
        return { error: "", success: "" };
    } else if (passwordConfirmValue !== passwordValue) {
        return { error: "비밀번호가 일치하지 않습니다.", success: "" };
    } else {
        return { error: "", success: "비밀번호가 일치합니다." };
    }
};
