export interface Product {
  id: string
  name: string
  description: string | null
  image_url: string | null
  price_per_unit: number
  unit_type: 'gramos' | 'kilos' | 'unidades'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem extends Product {
  quantity: number
  subtotal: number
}