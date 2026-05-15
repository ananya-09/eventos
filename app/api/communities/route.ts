import { NextResponse } from 'next/server'
import { createCommunitySchema } from '@/server/validators/community.validator'
import { CommunityService } from '@/server/services/community.service'

// Example: POST /api/communities
export async function POST(req: Request) {
  try {
    // 1. Get current user (Mocked here - use next-auth or similar)
    const userId = 'cmp4gqpfc0000fa2gkdv006yq'

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate body
    const body = await req.json()
    const validatedData = createCommunitySchema.parse(body)

    // 3. Delegate to Service Layer
    const community = await CommunityService.createCommunity(userId, validatedData)

    return NextResponse.json(community, { status: 201 })
  } catch (error: any) {
    console.error('[COMMUNITIES_POST]', error)

    // Zod validation error
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
