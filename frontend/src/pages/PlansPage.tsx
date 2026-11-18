import { useEffect, useState } from 'react'
import { getPlans } from '../api/plans'
import { PlanList } from '../components/PlanList'
import type { Plan } from '../types/plan'

// Container: loads the plans and handles loading, error and empty states
export function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ignores the response if the user leaves the page before it arrives
    let ignore = false

    getPlans()
      .then((response) => {
        if (!ignore) setPlans(response)
      })
      .catch(() => {
        if (!ignore) setError('The plans could not be loaded. Try again in a moment.')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main>
      <h1>Plans</h1>

      {isLoading && <p>Loading plans...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && plans.length === 0 && <p>There are no plans right now.</p>}
      {!isLoading && !error && plans.length > 0 && <PlanList plans={plans} />}
    </main>
  )
}
