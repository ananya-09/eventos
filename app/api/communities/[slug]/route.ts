import { NextResponse } from 'next/server'
import { CommunityService } from '@/server/services/community.service'

export async function GET(
  req: Request,
  context: { params: { slug: string } }
) {
  try {
    const slug = context.params.slug

    const community =
      await CommunityService.getCommunityBySlug(slug)

    return NextResponse.json(community)

  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message || 'Internal Server Error',
      },
      {
        status: 404,
      }
    )
  }
}