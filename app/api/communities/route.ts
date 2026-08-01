import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { createCommunitySchema } from "@/server/validators/community.validator";
import { CommunityService } from "@/server/services/community.service";

// POST /api/communities
export async function POST(req: Request) {
  try {
    // 1. Get authenticated session
    const session = await getServerSession(authOptions);

    // 2. Block unauthenticated users
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 3. Find logged-in user in database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // 4. User not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const creatorId = user.id;

    // 5. Parse request body
    const body = await req.json();

    // 6. Validate request body
    const validatedData = createCommunitySchema.parse(body);

    // 7. Delegate business logic to service layer
    const community = await CommunityService.createCommunity(
      creatorId,
      validatedData
    );

    // 8. Return response
    return NextResponse.json(
      {
        success: true,
        community,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[COMMUNITIES_POST]", error);

    // Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// GET /api/communities
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (user) {
        userId = user.id;
      }
    }

    const includeQuery: any = {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          members: true,
          posts: true,
        },
      },
    };

    if (userId) {
      includeQuery.members = {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      };
    }

    const communities = await prisma.community.findMany({
      include: includeQuery,
      orderBy: {
        createdAt: "desc",
      },
    });

    const communitiesWithMembership = communities.map((c: any) => {
      const isMember = userId ? (c.members && c.members.length > 0) : false;
      const { members, ...rest } = c;
      return {
        ...rest,
        isMember,
      };
    });

    return NextResponse.json({
      success: true,
      communities: communitiesWithMembership,
    });
  } catch (error: any) {
    console.error("[COMMUNITIES_GET]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}