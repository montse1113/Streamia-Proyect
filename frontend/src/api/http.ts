import axios from 'axios'
import { client } from '../conf/axios'

// Error that also keeps the HTTP status
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Gets the error message the API sent
function getErrorMessage(data: unknown) {
  const body = (data ?? {}) as { errors?: { message: string }[], message?: unknown }

  // 400: list of errors
  if (Array.isArray(body.errors)) {
    return body.errors.map((error) => error.message).join(' ')
  }

  // 401, 404, 409
  if (typeof body.message === 'string') {
    return body.message
  }

  return 'Something went wrong. Please try again later.'
}

// Calls the API with Axios. The token is only for protected routes
export async function apiFetch<T>(
  path: string,
  method = 'GET',
  body?: unknown,
  token?: string | null,
): Promise<T> {
  try {
    const response = await client.request<T>({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return response.data
  } catch (error) {
    // the API answered with an error (400, 401, 404...)
    if (axios.isAxiosError(error) && error.response) {
      throw new ApiError(error.response.status, getErrorMessage(error.response.data))
    }
    // no connection, server down or too slow
    throw new ApiError(0, 'We could not connect. Check your internet connection and try again.')
  }
}
