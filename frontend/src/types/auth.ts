//The user the API returns (never includes the password)
export interface User{
    id: number
    name: string
    lastName: string
    email: string
    role: 'admin' | 'customer'
}

export interface RegisterData{
    name: string
    lastName: string
    email: string
    password: string
}
    
export interface LoginData{
    email: string
    password: string
}

export interface LoginResponse{
    token: string
    user: User
}