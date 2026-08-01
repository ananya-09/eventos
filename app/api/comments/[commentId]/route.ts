import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CommunityRole } from "@prisma/client";

// DELETE /api/comments/[commentId]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
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

    // Retrieve comment with post details to identify the community slug/id
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            communityId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the current user is the author of the comment
    const isAuthor = comment.authorId === user.id;

    // Check if the current user is an ADMIN or MODERATOR of the community
    let isModerator = false;
    if (!isAuthor) {
      const membership = await prisma.communityMember.findUnique({
        where: {
          userId_communityId: {
            userId: user.id,
            communityId: comment.post.communityId,
          },
        },
      });

      if (membership && (membership.role === CommunityRole.ADMIN || membership.role === CommunityRole.MODERATOR)) {
        isModerator = true;
      }
    }

    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot delete this comment" },
        { status: 403 }
      );
    }

    // Perform soft delete
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      comment: updatedComment,
    });
  } catch (error: any) {
    console.error("DELETE COMMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
