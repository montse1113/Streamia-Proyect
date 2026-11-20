import type { Plan } from '../types/plan'

interface PlanCardProps {
  plan: Plan
}

// Only shows one plan, it does not call the API
export function PlanCard({ plan }: PlanCardProps) {
  return (
    <article>
      <h2>{plan.name}</h2>
      <p>${plan.price.toFixed(2)} MXN / month</p>
      <ul>
        <li>Quality: {plan.maxQuality}</li>
        <li>Screens: {plan.maxScreens}</li>
      </ul>
    </article>
  )
}
