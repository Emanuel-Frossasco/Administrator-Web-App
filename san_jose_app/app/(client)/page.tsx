import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/client/ProductCard'
import { Header } from '@/components/client/Header'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Especias Artesanales
          </h1>
          <p className="text-lg text-amber-800 max-w-2xl mx-auto">
            Las mejores especias y condimentos para realzar tus comidas
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-amber-700">
              No hay productos disponibles en este momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}