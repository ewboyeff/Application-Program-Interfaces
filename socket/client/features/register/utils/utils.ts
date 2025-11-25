import { hasLength, hasMixedCase, hasNumber, hasSymbol } from "../helpers/ValidationPasword";

export const evaluatePasswordStrength  = (password: string) => {

    
    const strength = [hasNumber(password), hasMixedCase(password), hasSymbol(password), hasLength(password)] 
  
    
    const values = strength.filter((s) => s === true);

    if(values.length <= 1) return "weak";
    if(values.length <= 3) return "medium";
    return "strong"
}