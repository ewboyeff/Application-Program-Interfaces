export const hasNumber = (password: string) => {
   return /\d/.test(password) 
}

export const hasMixedCase = (password:string) => {
    return /[a-z]/.test(password) && /[A-Z]/.test(password)
}

export const hasSymbol = (password: string) => {
    return /[!@#$%^&*_=-]/.test(password)
}

export const hasLength = (password: string) => {
    return password.length >= 7
}


