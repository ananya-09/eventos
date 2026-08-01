import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/comments/[commentId]/replies
export async function GET(
  req: Request,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await context.params;
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

    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
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
    if (replies.length > limit) {
      const nextItem = replies.pop();
      nextCursor = nextItem!.id;
    }

    const repliesWithVotes = replies.map((reply: any) => {
      const userVoteRecord = userId && reply.votes && reply.votes[0] ? reply.votes[0] : null;
      const userVote = userVoteRecord ? userVoteRecord.value : null;
      const { votes, ...rest } = reply;
      return {
        ...rest,
        userVote,
      };
    });

    return NextResponse.json({
      success: true,
      replies: repliesWithVotes,
      nextCursor,
    });
  } catch (error: any) {
    console.error("GET REPLIES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
