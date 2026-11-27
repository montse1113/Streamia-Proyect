import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same look as the button of the 404 page
const buttonClass =
  'mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'

// Stripe sends the user here after paying (success_url in the backend)
export function SubscriptionSuccessPage() {
  const { user } = useAuth()

  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">PAYMENT RECEIVED</p>
      <h1 className="mt-2 text-3xl font-bold">Thanks for subscribing!</h1>
      {/* the webhook activates the plan, it can take a few seconds */}
      <p className="mt-4 text-slate-600">Your plan will be active in a few moments.</p>

      {/* the session lives in memory, so after leaving for Stripe there is no user */}
      {user ? (
        <Link to="/catalog" className={buttonClass}>
          Go to the catalog
        </Link>
      ) : (
        <Link to="/login" className={buttonClass}>
          Log in to start watching
        </Link>
      )}
    </section>
  )
}
