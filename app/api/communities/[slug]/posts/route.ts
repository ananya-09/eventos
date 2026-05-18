import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const session = await getServerSession(authOptions);

    // 1. Fetch community
    const community = await prisma.community.findUnique({
      where: { slug },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // 2. Fetch authenticated user ID if logged in
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

    // 3. Construct relations query dynamically
    const includeQuery: any = {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      comments: {
        take: 2,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    };

    if (userId) {
      includeQuery.likes = {
        where: { userId },
        select: { userId: true },
      };
    }

    // 4. Query posts efficiently
    const posts = await prisma.post.findMany({
      where: { communityId: community.id },
      include: includeQuery,
      orderBy: { createdAt: "desc" },
    });

    // 5. Map isLiked into responses cleanly without N+1 overhead
    const postsWithLikes = posts.map((post: any) => {
      const isLiked = userId ? (post.likes && post.likes.length > 0) : false;
      const { likes, ...rest } = post;
      return {
        ...rest,
        isLiked,
      };
    });

    return NextResponse.json({
      success: true,
      posts: postsWithLikes,
    });
  } catch (error) {
    console.error("GET COMMUNITY POSTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
