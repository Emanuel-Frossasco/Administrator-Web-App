import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { orderId, clientName, total } = await request.json()

    const message = `🌶️ *Nuevo Pedido Recibido*

📦 ID: ${orderId.substring(0, 8)}
👤 Cliente: ${clientName}
💰 Total: $${total.toFixed(2)}

Revisa el panel de administración para más detalles.`

    // Implementar integración con WhatsApp Business API
    // o usar servicios como Twilio, MessageBird, etc.
    
    const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    // Por ahora, solo retornamos la URL
    // En producción, aquí harías la llamada al API de WhatsApp
    console.log('WhatsApp notification:', whatsappUrl)

    return NextResponse.json({ 
      success: true,
      message: 'Notificación preparada',
      whatsappUrl 
    })
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar notificación' },
      { status: 500 }
    )
  }
}