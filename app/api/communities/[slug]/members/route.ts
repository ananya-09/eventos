import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // 1. Verify community existence
    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // 2. Fetch all members using highly optimized relation query, avoiding N+1
    const members = await prisma.communityMember.findMany({
      where: { communityId: community.id },
      orderBy: { joinedAt: "desc" },
      select: {
        id: true,
        joinedAt: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // 3. Flatten structure to match frontend requirements
    const formattedMembers = members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      joinedAt: m.joinedAt.toISOString(),
      role: m.role,
    }));

    return NextResponse.json({
      success: true,
      count: formattedMembers.length,
      members: formattedMembers,
    });
  } catch (error) {
    console.error(`Failed to fetch members for community ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
