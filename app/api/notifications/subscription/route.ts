import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/server/services/notification.service";
import { SubscriptionTarget, SubscriptionType } from "@prisma/client";
import { z } from "zod";

const subscriptionSchema = z.object({
  targetType: z.nativeEnum(SubscriptionTarget),
  targetId: z.string().min(1, "Target ID is required"),
  type: z.nativeEnum(SubscriptionType).optional(),
  remove: z.boolean().optional().default(false),
});

// POST /api/notifications/subscription
// Upserts or removes a thread/community subscription (watch or mute)
export async function POST(req: Request) {
  try {
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

    const body = await req.json().catch(() => ({}));
    const validated = subscriptionSchema.parse(body);

    if (validated.remove) {
      await NotificationService.removeSubscription(
        user.id,
        validated.targetType,
        validated.targetId
      );
      return NextResponse.json({
        success: true,
        message: "Subscription removed successfully",
      });
    }

    if (!validated.type) {
      return NextResponse.json(
        { success: false, message: "Subscription type (WATCH or MUTE) is required unless removing" },
        { status: 400 }
      );
    }

    const subscription = await NotificationService.setSubscription({
      userId: user.id,
      targetType: validated.targetType,
      targetId: validated.targetId,
      type: validated.type,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully set subscription to ${validated.type}`,
      subscription,
    });
  } catch (error: any) {
    console.error("SUBSCRIPTION ERROR:", error);
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
