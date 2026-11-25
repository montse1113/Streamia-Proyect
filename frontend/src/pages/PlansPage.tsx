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
    // section
    <section>
      <h1 className="mb-2 text-3xl font-bold">Plans</h1>
      <p className="mb-6 text-slate-600">Choose the plan that fits you best.</p>

      {isLoading && <p className="py-8 text-center text-slate-500">Loading plans...</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-red-100 p-4 text-center text-red-700">
          {error}
        </p>
      )}
      {!isLoading && !error && plans.length === 0 && (
        <p className="py-8 text-center">There are no plans right now.</p>
      )}
      {!isLoading && !error && plans.length > 0 && <PlanList plans={plans} />}
    </section>
  )
}
