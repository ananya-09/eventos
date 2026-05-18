import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { createCommentSchema } from "@/server/validators/comment.validator";

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