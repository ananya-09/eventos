import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // 1. Validate community existence
    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // 2. Fetch all events for this community
    const dbEvents = await prisma.event.findMany({
      where: { communityId: community.id },
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        banner: true,
        location: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    const now = new Date();

    const formattedEvents = dbEvents.map((evt) => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      banner: evt.banner,
      location: evt.location,
      startDate: evt.startDate.toISOString(),
      endDate: evt.endDate.toISOString(),
      createdAt: evt.createdAt.toISOString(),
      creator: {
        id: evt.creator.id,
        name: evt.creator.name,
        image: evt.creator.image,
        email: evt.creator.email,
      },
    }));

    // Separate upcoming and past events
    const upcomingEvents = formattedEvents.filter(
      (evt) => new Date(evt.startDate) >= now || new Date(evt.endDate) >= now
    );
    const pastEvents = formattedEvents.filter(
      (evt) => new Date(evt.endDate) < now && new Date(evt.startDate) < now
    );

    return NextResponse.json({
      success: true,
      upcomingCount: upcomingEvents.length,
      pastCount: pastEvents.length,
      totalCount: formattedEvents.length,
      upcomingEvents,
      pastEvents,
    });
  } catch (error) {
    console.error(`Failed to fetch events for community ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // 1. Check session authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, image: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Validate community existence
    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Community not found" },
        { status: 404 }
      );
    }

    // 3. Verify user membership
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: community.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, message: "You must join this community to schedule events." },
        { status: 403 }
      );
    }

    // 4. Parse and validate fields
    const body = await request.json();
    const { title, description, banner, location, startDate, endDate } = body;

    if (!title || !description || !location || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 5. Save the event in the database
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        banner: banner || null,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        communityId: community.id,
        createdById: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        banner: true,
        location: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        ...newEvent,
        startDate: newEvent.startDate.toISOString(),
        endDate: newEvent.endDate.toISOString(),
        createdAt: newEvent.createdAt.toISOString(),
        creator: {
          id: user.id,
          name: user.name,
          image: user.image,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.error(`Failed to create event in community ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
