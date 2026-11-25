import type { Plan } from '../types/plan'

interface PlanCardProps {
  plan: Plan
}

// Only shows one plan, it does not call the API
export function PlanCard({ plan }: PlanCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">{plan.name}</h2>
      <p className="mt-2">
        <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
        <span className="text-slate-500"> MXN / month</span>
      </p>
      <ul className="mt-4 space-y-1 text-slate-700">
        <li>Quality: {plan.maxQuality}</li>
        <li>Screens: {plan.maxScreens}</li>
      </ul>
    </article>
  )
}
