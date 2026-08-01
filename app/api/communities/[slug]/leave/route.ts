import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Get slug
    const { slug } = await context.params;

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

    // 5. User not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 6. Find community
    const community = await prisma.community.findUnique({
      where: {
        slug,
      },
    });

    // 7. Community not found
    if (!community) {
      return NextResponse.json(
        {
          success: false,
          message: "Community not found",
        },
        { status: 404 }
      );
    }

    // 8. Find membership
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: community.id,
        },
      },
    });

    // 9. Membership missing
    if (!membership) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not a member of this community",
        },
        { status: 400 }
      );
    }

    // 10. Prevent creator from leaving
    if (community.creatorId === user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Community creator cannot leave the community",
        },
        { status: 400 }
      );
    }

    // 11. Delete membership
    await prisma.communityMember.delete({
      where: {
        id: membership.id,
      },
    });

    // 12. Success
    return NextResponse.json({
      success: true,
      message: "Left community successfully",
    });

  } catch (error) {
    console.error("LEAVE COMMUNITY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}