import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;

        const userId = "cmp4gqpfc0000fa2gkdv006yq";

        const community = await prisma.community.findUnique({
            where: {
                slug,
            },
        });

        if (!community) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Community not found",
                },
                { status: 404 }
            );
        }

        const existingMembership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId: community.id,
                },
            },
        });

        if (existingMembership) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Already joined this community",
                },
                { status: 400 }
            );
        }

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