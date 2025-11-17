'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  const increment = () => setQuantity((q) => q + 1)
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl">🌶️</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold text-amber-900 mb-2 hover:text-amber-700">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-amber-600">
              {formatPrice(product.price_per_unit)}
            </p>
            <p className="text-sm text-gray-500">por {product.unit_type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border rounded-md py-1"
            min="1"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600">{product.unit_type}</span>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  )
}