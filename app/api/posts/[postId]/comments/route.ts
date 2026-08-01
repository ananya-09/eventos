import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { createCommentSchema } from "@/server/validators/comment.validator";
import { NotificationService } from "@/server/services/notification.service";

// GET /api/posts/[postId]/comments
export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

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

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
        ...(userId ? {
          votes: {
            where: { userId },
            select: { value: true },
          },
        } : {}),
      },
    });

    let nextCursor: string | null = null;
    if (comments.length > limit) {
      const nextItem = comments.pop();
      nextCursor = nextItem!.id;
    }

    const commentsWithVotes = comments.map((comment: any) => {
      const userVoteRecord = userId && comment.votes && comment.votes[0] ? comment.votes[0] : null;
      const userVote = userVoteRecord ? userVoteRecord.value : null;
      const { votes, ...rest } = comment;
      return {
        ...rest,
        userVote,
      };
    });

    return NextResponse.json({
      success: true,
      comments: commentsWithVotes,
      nextCursor,
    });
  } catch (error: any) {
    console.error("GET COMMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[postId]/comments
export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // 1. Get postId
    const { postId } = await context.params;

    // 2. Get session
    const session = await getServerSession(authOptions);

    // 3. Unauthorized
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 4. Find user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // 5. User missing
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 6. Find post
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // 7. Post missing
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // 8. Parse body
    const body = await req.json();

    // 9. Validate body
    const validatedData =
      createCommentSchema.parse(body);

    // 10. Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        authorId: user.id,
        postId: post.id,
        parentId: validatedData.parentId || undefined,
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
    });

    // Fire notifications and log activity in a non-blocking background thread
    Promise.all([
      NotificationService.notifySubscribers({
        postId: post.id,
        commentId: comment.id,
        authorId: user.id,
        commentContent: comment.content,
      }),
      NotificationService.parseMentionsAndNotify({
        content: comment.content,
        postId: post.id,
        commentId: comment.id,
        authorId: user.id,
      }),
      NotificationService.logActivity({
        userId: user.id,
        communityId: post.communityId,
        type: "CREATE_COMMENT",
        entityType: "Comment",
        entityId: comment.id,
      }),
    ]).catch((err) => {
      console.error("BACKGROUND NOTIFICATION DISPATCH ERROR:", err);
    });

    // 11. Success
    return NextResponse.json(
      {
        success: true,
        comment,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("CREATE COMMENT ERROR:", error);

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
        message:
          error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}