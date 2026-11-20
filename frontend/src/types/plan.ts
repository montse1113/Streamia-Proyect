// A plan the API returns (never includes the Stripe price id)
export interface Plan {
  id: number
  name: string
  price: number
  maxQuality: 'SD' | 'HD' | '4K'
  maxScreens: number
}

