import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/server/services/notification.service";

// GET /api/notifications
// Retrieves paginated list of notifications and total unread count for current user
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

    const [unreadCount, result] = await Promise.all([
      NotificationService.getUnreadCount(user.id),
      NotificationService.getNotifications(user.id, limit, cursor),
    ]);

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: result.notifications,
      nextCursor: result.nextCursor,
    });
  } catch (error: any) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications
// Marks all or specific notifications as read
export async function PATCH(req: Request) {
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
    const { notificationIds, all } = body;

    if (all) {
      await NotificationService.markAllAsRead(user.id);
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await NotificationService.markAsRead(user.id, notificationIds);
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid payload: specify 'all: true' or 'notificationIds: []'" },
        { status: 400 }
      );
    }

    // Return the updated unread count to allow clients to update badge in one roundtrip
    const unreadCount = await NotificationService.getUnreadCount(user.id);

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
      unreadCount,
    });
  } catch (error: any) {
    console.error("PATCH NOTIFICATIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
