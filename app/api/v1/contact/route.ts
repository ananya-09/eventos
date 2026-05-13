import { NextRequest, NextResponse } from 'next/server'

// Rate limiting helper (basic in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 3600000) {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count < maxRequests) {
    record.count++
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip, 5, 3600000)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { message: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // TODO: Implement actual email sending or database persistence
    // For now, just log and return success
    console.error('Contact form submission:', { name, email, subject, message })

    return NextResponse.json(
      { message: 'Thank you for your message. We will be in touch soon.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
