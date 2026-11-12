import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/auth'
import { ApiError, apiFetch } from '../api/http'
import type { LoginData, User } from '../types/auth'
import { AuthContext } from './AuthContext'

// Keeps the token and the user in memory (not in localStorage)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  // If the API says the data is wrong, the error goes to the login page
  async function login(data: LoginData) {
    const response = await loginRequest(data)
    setToken(response.token)
    setUser(response.user)
  }

  function logout() {
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  // For protected routes: sends the token and logs out on 401
  async function authFetch<T>(path: string, method = 'GET', body?: unknown) {
    try {
      return await apiFetch<T>(path, method, body, token)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout()
      }
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}
