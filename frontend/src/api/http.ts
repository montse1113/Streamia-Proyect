const API_URL = '/api/v1'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()

    if (Array.isArray(body.errors)) {
      return body.errors.map((error: { message: string }) => error.message).join(' ')
    }
    if (typeof body.message === 'string') {
      return body.message
    }
  } catch {
     // the answer was not JSON, so we use the generic message below
  }

  return 'Something went wrong. Please try again later.'
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(0, 'We could not connect. Check your internet connection and try again.')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await getErrorMessage(response))
  }

  return response.json() as Promise<T>
}
