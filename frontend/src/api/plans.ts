import type { Plan } from '../types/plan'
import { apiFetch } from './http'

// Gets the active plans (public, no token needed)
export async function getPlans() {
  const response = await apiFetch<{ data: Plan[] }>('/plans')
  return response.data
}
