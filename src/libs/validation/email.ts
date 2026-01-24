export interface ValidationResult {
    error: string;
    success: string;
}

export const validateEmail = (emailValue: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValue === "") {
        return { error: "", success: "" };
    } else if (emailRegex.test(emailValue)) {
        return { error: "", success: "" };
    } else {
        return { error: "올바른 이메일 형식을 입력해주세요.", success: "" };
    }
};
