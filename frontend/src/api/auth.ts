import type { LoginData, LoginResponse, RegisterData } from '../types/auth'

const API_URL = '/api/v1'

// Turns the error the API sends into one message we can show in the form
async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()

    // 400 from the validator: { errors: [{ field, message }] }
    if (Array.isArray(body.errors)) {
      return body.errors.map((error: { message: string }) => error.message).join(' ')
    }

    // 401, 409, 429...: { message }
    if (typeof body.message === 'string') {
      return body.message
    }
  } catch {
    // The answer was not JSON
  }

  return 'Something went wrong. Please try again later.'
}

// Sends data with POST and returns the answer, or throws an Error with the API message
async function postJson<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json() as Promise<T>
}

export function register(data: RegisterData) {
  return postJson<{ message: string }>('/auth/register', data)
}

export function login(data: LoginData) {
  return postJson<LoginResponse>('/auth/login', data)
}