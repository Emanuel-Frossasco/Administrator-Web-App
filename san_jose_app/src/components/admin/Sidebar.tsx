'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Productos', href: '/admin/products', icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="w-64 bg-amber-900 text-white flex flex-col">
      <div className="p-6 border-b border-amber-800">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🌶️</span>
          <div>
            <h1 className="text-lg font-bold">Especias Admin</h1>
            <p className="text-xs text-amber-300">Panel de control</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-amber-800 text-white'
                      : 'text-amber-100 hover:bg-amber-800/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-amber-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-amber-100 hover:bg-amber-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}