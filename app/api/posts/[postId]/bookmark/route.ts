import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
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

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });

      return NextResponse.json({
        success: true,
        bookmarked: true,
        message: "Bookmarked successfully",
      });
    }
  } catch (error: any) {
    console.error("BOOKMARK POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
