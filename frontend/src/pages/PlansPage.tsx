import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlans } from '../api/plans'
import { PlanList } from '../components/PlanList'
import { alertClass, loadingClass } from '../components/statusStyles'
import { useAuth } from '../context/AuthContext'
import type { Plan } from '../types/plan'

// Container: loads the plans, handles the states and starts the Stripe checkout
export function PlansPage() {
  const { user, authFetch } = useAuth()
  const navigate = useNavigate()

  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // id of the plan being sent to Stripe, null when none
  const [subscribingId, setSubscribingId] = useState<number | null>(null)
  const [subscribeError, setSubscribeError] = useState<string | null>(null)

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

  async function handleSubscribe(planId: number) {
    // without a session the API would answer 401, so we go to the login first
    if (!user) {
      // tells the login page to come back here after logging in
      navigate('/login', { state: { from: '/plans' } })
      return // stop here: without a session we do not call the API
    }

    setSubscribeError(null)
    setSubscribingId(planId)

    try {
      // only the planId is sent; the user comes from the token
      const response = await authFetch<{ data: { url: string } }>('/subscriptions/checkout', 'POST', { planId })
      // Stripe is another website, so we leave the app with a full page change
      window.location.href = response.data.url
    } catch (err) {
      // 409: "You already have an active subscription." comes from the API
      setSubscribeError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
      setSubscribingId(null)
    }
  }

  return (
    // section, not main: App.tsx already has the <main>
    <section>
      <h1 className="mb-2 text-3xl font-bold">Plans</h1>
      <p className="mb-6 text-slate-600">Choose the plan that fits you best.</p>

      {subscribeError && (
        <p role="alert" className={`${alertClass} mb-6`}>
          {subscribeError}
        </p>
      )}

      {isLoading && <p className={loadingClass}>Loading plans...</p>}
      {error && (
        <p role="alert" className={alertClass}>
          {error}
        </p>
      )}
      {!isLoading && !error && plans.length === 0 && (
        <p className="py-8 text-center">There are no plans right now.</p>
      )}
      {!isLoading && !error && plans.length > 0 && (
        <PlanList plans={plans} onSubscribe={handleSubscribe} subscribingId={subscribingId} />
      )}
    </section>
  )
}