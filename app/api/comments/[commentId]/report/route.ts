import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reportSchema = z.object({
  reason: z.string().min(3, "Reason too short").max(200, "Reason too long"),
});

// POST /api/comments/[commentId]/report
export async function POST(
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

    // Validate body
    const body = await req.json();
    const validated = reportSchema.parse(body);

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user already reported this comment
    const existingReport = await prisma.commentReport.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { success: false, message: "You have already reported this comment" },
        { status: 409 }
      );
    }

    // Create report
    const report = await prisma.commentReport.create({
      data: {
        userId: user.id,
        commentId,
        reason: validated.reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment reported successfully",
      report,
    });
  } catch (error: any) {
    console.error("REPORT COMMENT ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
