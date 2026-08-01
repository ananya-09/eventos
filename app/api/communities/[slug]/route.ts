import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageCommunityBranding } from "@/lib/community/permissions";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // 1. Fetch community details with counts in a single query
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // 2. Fetch organizers list (creator + users with ADMIN/MODERATOR membership roles)
    const dbOrganizers = await prisma.communityMember.findMany({
      where: {
        communityId: community.id,
        role: { in: ["ADMIN", "MODERATOR"] },
      },
      select: {
        joinedAt: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    // Format organizers and ensure the creator is represented
    const organizersList = dbOrganizers.map((org) => ({
      id: org.user.id,
      name: org.user.name,
      image: org.user.image,
      email: org.user.email,
      role: org.role,
      joinedAt: org.joinedAt.toISOString(),
    }));

    // If the creator is not in the list, prepend them as ADMIN creator
    if (!organizersList.some((o) => o.id === community.creatorId)) {
      organizersList.unshift({
        id: community.creator.id,
        name: community.creator.name,
        image: community.creator.image,
        email: community.creator.email,
        role: "ADMIN",
        joinedAt: community.createdAt.toISOString(),
      });
    }

    // 3. Fetch a sample of featured members (regular members, non-organizers)
    const dbFeatured = await prisma.communityMember.findMany({
      where: {
        communityId: community.id,
        role: "MEMBER",
      },
      take: 6,
      select: {
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const featuredMembers = dbFeatured.map((feat) => ({
      id: feat.user.id,
      name: feat.user.name,
      image: feat.user.image,
      joinedAt: feat.joinedAt.toISOString(),
    }));

    // 4. Determine membership and branding permissions for current user
    let isMember = false;
    let canManageBranding = false;
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        const membership = await prisma.communityMember.findUnique({
          where: {
            userId_communityId: {
              userId: user.id,
              communityId: community.id,
            },
          },
        });
        isMember = !!membership;
        canManageBranding = await canManageCommunityBranding(user.id, community.id);
      }
    }

    // 5. Calculate brand pill tags based on community slug/topics
    const slugLower = community.slug.toLowerCase();
    let tags = ["Community", "Networking", "Events"];
    if (slugLower.includes("dev") || slugLower.includes("code") || slugLower.includes("tech") || slugLower.includes("js")) {
      tags = ["Web Development", "Open Source", "Software Engineering", "Tech Hub"];
    } else if (slugLower.includes("design") || slugLower.includes("ui") || slugLower.includes("ux")) {
      tags = ["UI/UX Design", "Product Design", "Creative Tools", "Figma"];
    } else if (slugLower.includes("ai") || slugLower.includes("ml") || slugLower.includes("data")) {
      tags = ["Artificial Intelligence", "Machine Learning", "Data Science", "Python"];
    }

    // Calculate dynamic socials mapping
    const socials = {
      website: `https://${community.slug}.eventos.io`,
      discord: `https://discord.gg/${community.slug}`,
      github: `https://github.com/communities/${community.slug}`,
      twitter: `https://twitter.com/${community.slug}`,
      linkedin: `https://linkedin.com/company/${community.slug}`,
    };

    return NextResponse.json({
      success: true,
      community,
      isMember,
      canManageBranding,
      organizers: organizersList,
      featuredMembers,
      tags,
      socials,
      upcomingEvent: null, // Pristine default placeholder trigger
    });

  } catch (error) {
    console.error("GET COMMUNITY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}