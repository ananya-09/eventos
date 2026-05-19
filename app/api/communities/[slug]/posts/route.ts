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
      includeQuery.votes = {
        where: { userId },
        select: { value: true },
      };
    }

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "hot";

    let orderBy: any = { createdAt: "desc" };
    if (sort === "hot") {
      orderBy = { hotScore: "desc" };
    } else if (sort === "top") {
      orderBy = { score: "desc" };
    }

    // 4. Query posts efficiently
    const posts = await prisma.post.findMany({
      where: { communityId: community.id },
      include: includeQuery,
      orderBy,
    });

    // 5. Map isLiked into responses cleanly without N+1 overhead
    const postsWithLikes = posts.map((post: any) => {
      const userVoteRecord = userId && post.votes && post.votes[0] ? post.votes[0] : null;
      const userVote = userVoteRecord ? userVoteRecord.value : null;
      const isLiked = userVote === 1;
      const { votes, ...rest } = post;
      return {
        ...rest,
        userVote,
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
