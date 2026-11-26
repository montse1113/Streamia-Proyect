import { Link } from 'react-router-dom'

// Stripe sends the user here after paying (success_url in the backend)
export function SubscriptionSuccessPage() {
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">PAYMENT RECEIVED</p>
      <h1 className="mt-2 text-3xl font-bold">Thanks for subscribing!</h1>
      {/* the webhook activates the plan, it can take a few seconds */}
      <p className="mt-4 text-slate-600">Your plan will be active in a few moments.</p>
      <Link
        to="/catalog"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Go to the catalog
      </Link>
    </section>
  )
}