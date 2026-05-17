import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;

        // Get logged in session
        const session = await getServerSession(authOptions);

        // Block unauthenticated users
        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // Find real user from database
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        // User does not exist
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const userId = user.id;

        // Find community
        const community = await prisma.community.findUnique({
            where: {
                slug,
            },
        });

        // Community does not exist
        if (!community) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Community not found",
                },
                { status: 404 }
            );
        }

        // Check existing membership
        const existingMembership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId: community.id,
                },
            },
        });

        // Prevent duplicate joins
        if (existingMembership) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Already joined this community",
                },
                { status: 400 }
            );
        }

        // Create membership
        const membership = await prisma.communityMember.create({
            data: {
                userId,
                communityId: community.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Joined community successfully",
            membership,
        });

    } catch (error) {
        console.error("JOIN COMMUNITY ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}