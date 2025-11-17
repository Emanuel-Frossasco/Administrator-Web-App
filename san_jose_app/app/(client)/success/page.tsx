import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Header } from '@/components/client/Header'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
          
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            ¡Pedido Confirmado!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido con éxito. Nos pondremos en contacto contigo
            en breve para coordinar la entrega.
          </p>

          <div className="bg-amber-50 rounded-md p-4 mb-6">
            <p className="text-sm text-amber-800">
              Recibirás una notificación por WhatsApp con los detalles de tu pedido.
            </p>
          </div>

          <Link href="/">
            <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}