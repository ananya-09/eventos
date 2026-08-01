import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reportSchema = z.object({
  reason: z.string().min(3, "Reason too short").max(200, "Reason too long"),
});

// POST /api/posts/[postId]/report
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

    // Validate body
    const body = await req.json();
    const validated = reportSchema.parse(body);

    // Placeholder stub (does not save to database since there is no PostReport table)
    return NextResponse.json({
      success: true,
      message: "Post reported successfully",
      report: {
        id: "mock-report-id",
        targetType: "POST",
        targetId: postId,
        reason: validated.reason,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("REPORT POST ERROR:", error);
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
