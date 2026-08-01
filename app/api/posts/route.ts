import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPostSchema } from "@/server/validators/post.validator";
import { PostService } from "@/server/services/post.service";

// GET /api/posts
export async function GET(req: Request) {
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
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
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

    // 1. Fetch all posts
    const posts = await prisma.post.findMany({
      include: includeQuery,
      orderBy,
    });

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

    // 2. Success
    return NextResponse.json({
      success: true,
      posts: postsWithLikes,
    });

  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = createPostSchema.parse(body);

    const post = await PostService.createPost(user.id, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("CREATE POST ERROR:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}