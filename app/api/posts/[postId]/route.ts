import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

// GET /api/posts/[postId]
export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // 1. Get postId
    const { postId } = await context.params;

    // 2. Find post
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },

      include: {
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

        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // 3. Post missing
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // 4. Success
    return NextResponse.json({
      success: true,
      post,
    });

  } catch (error) {
    console.error("GET POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[postId]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // 1. Get postId from dynamic params
    const { postId } = await context.params;

    // 2. Verify authenticated session
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

    // 5. Verify the current user is the author of the post
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You are not the author of this post" },
        { status: 403 }
      );
    }

    // 6. Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    // 7. Return success response
    return NextResponse.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE POST ERROR:", error);

    // 8. Handle unexpected errors
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[postId]
export async function PATCH(
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

    if (post.authorId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You are not the author of this post" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (title && (title.trim().length < 3 || title.trim().length > 200)) {
      return NextResponse.json(
        { success: false, message: "Title must be between 3 and 200 characters" },
        { status: 400 }
      );
    }
    if (content && content.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Content must be at least 10 characters" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title || undefined,
        content: content || undefined,
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

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });

  } catch (error) {
    console.error("PATCH POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}