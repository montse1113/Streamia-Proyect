export interface Plan {
    id: number
    name: string
    price: number
    maxQuality: '5D' | 'HD' | '4K'
    maxScreens: number
}