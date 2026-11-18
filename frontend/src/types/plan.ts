export interface Plan {
    id: number
    name: string
    price: number
     maxQuality: 'SD' | 'HD' | '4K'
    maxScreens: number
}