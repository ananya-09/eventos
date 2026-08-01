import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // 1. Get postId from dynamic params
    const { postId } = await context.params;

    // 2. Check authenticated session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Find current user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 4. Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // 5. Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // 6a. If already liked: delete like
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Post unliked",
      });
    } else {
      // 6b. If not liked: create like
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Post liked",
      });
    }
  } catch (error: any) {
    console.error("LIKE POST ERROR:", error);
    // 7. Internal server error handling
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
