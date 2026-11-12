import type { LoginData, LoginResponse, RegisterData, User } from '../types/auth'
import { apiFetch } from './http'

// 201: { message, user }. 400 and 409 come as an ApiError with the message to show
export function register(data: RegisterData) {
  return apiFetch<{ message: string, user: User }>('/auth/register', 'POST', data)
}

// 200: { token, user }. 401 (wrong email or password) comes as an ApiError
export function login(data: LoginData) {
  return apiFetch<LoginResponse>('/auth/login', 'POST', data)
}
