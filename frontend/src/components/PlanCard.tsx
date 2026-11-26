import type { Plan } from '../types/plan'

interface PlanCardProps {
  plan: Plan
  onSubscribe: (planId: number) => void
  isSubscribing: boolean // this plan is being sent to Stripe
  disabled: boolean // any plan is being sent, so no double clicks
}

// Only shows one plan, it does not call the API
export function PlanCard({ plan, onSubscribe, isSubscribing, disabled }: PlanCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">{plan.name}</h2>
      <p className="mt-2">
        <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
        <span className="text-slate-500"> MXN / month</span>
      </p>
      <ul className="mt-4 mb-6 space-y-1 text-slate-700">
        <li>Quality: {plan.maxQuality}</li>
        <li>Screens: {plan.maxScreens}</li>
      </ul>

      {/* mt-auto pushes the button to the bottom of the card */}
      <button
        type="button"
        onClick={() => onSubscribe(plan.id)}
        disabled={disabled}
        className="mt-auto rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubscribing ? 'Redirecting to Stripe...' : 'Subscribe'}
      </button>
    </article>
  )
}