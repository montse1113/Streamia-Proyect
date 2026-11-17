import { createContext, useContext } from 'react'
import type { LoginData, User } from '../types/auth'

// What any component can use from the session
export interface AuthContextValue {
  token: string | null
  user: User | null
  login: (data: LoginData) => Promise<void>
  logout: () => void
  authFetch: <T>(path: string, method?: string, body?: unknown) => Promise<T>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

// Gives access to the session from any component
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
