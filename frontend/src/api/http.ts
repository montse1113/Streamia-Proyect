const API_URL = '/api/v1'

// Error that also keeps the HTTP status (401, 404...)
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Gets the error message the API sent
async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()

    // 400: list of errors
    if (Array.isArray(body.errors)) {
      return body.errors.map((error: { message: string }) => error.message).join(' ')
    }

    // 401, 404, 409...: one message
    if (typeof body.message === 'string') {
      return body.message
    }
  } catch {
    // not JSON
  }

  return 'Something went wrong. Please try again later.'
}

// Calls the API. The token is only for protected routes
export async function apiFetch<T>(
  path: string,
  method = 'GET',
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // no connection or server down
    throw new ApiError(0, 'We could not connect. Check your internet connection and try again.')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await getErrorMessage(response))
  }

  return response.json() as Promise<T>
}
