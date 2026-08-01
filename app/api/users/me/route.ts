import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users/me
export async function GET() {
  try {
    // 1. Verify authenticated session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Find current user and use Prisma 'select' to avoid overfetching
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        // Base user info
        id: true,
        name: true,
        email: true,
        image: true,
        
        // Created communities
        communitiesOwned: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        
        // Joined communities via memberships
        memberships: {
          select: {
            role: true,
            joinedAt: true,
            community: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: "desc",
          },
        },
        
        // Authored posts
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            community: {
              select: {
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        
        // Aggregated counts
        _count: {
          select: {
            posts: true,
            memberships: true,
            communitiesOwned: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Return successfully fetched and structured user data
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("GET USER ME ERROR:", error);

    // 4. Handle unexpected server errors
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
