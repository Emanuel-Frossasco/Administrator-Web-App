'use client'

import { useEffect, useState } from 'react'
import { formatPrice, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  delivery_method: string
  notes: string | null
  clients: {
    name: string
    phone: string
    address: string | null
  }
  order_items: Array<{
    quantity: number
    products: {
      name: string
      unit_type: string
    }
  }>
}

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'preparacion', label: 'En Preparación', color: 'bg-blue-100 text-blue-800' },
  { value: 'listo', label: 'Listo', color: 'bg-green-100 text-green-800' },
  { value: 'entregado', label: 'Entregado', color: 'bg-gray-100 text-gray-800' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select(`
        *,
        clients (name, phone, address),
        order_items (
          quantity,
          products (name, unit_type)
        )
      `)
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      alert('Error al actualizar el estado')
    } else {
      fetchOrders()
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gestión de Pedidos
        </h1>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              variant={filter === status.value ? 'default' : 'outline'}
              onClick={() => setFilter(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.clients.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.clients.phone}
                </p>
                {order.clients.address && (
                  <p className="text-sm text-gray-600">
                    📍 {order.clients.address}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">
                  {formatPrice(order.total_amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Productos:</h4>
              <ul className="space-y-1">
                {order.order_items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    • {item.products.name} - {item.quantity} {item.products.unit_type}
                  </li>
                ))}
              </ul>
            </div>

            {order.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Observaciones:</strong> {order.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Estado:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusOptions.find(s => s.value === order.status)?.color
              }`}>
                {order.delivery_method === 'envio' ? '🚚 Envío' : '🏪 Retiro'}
              </span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No hay pedidos para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}