import { prisma } from "@/lib/prisma";

export async function seedCommunityDiscussions(communityId: string) {
  try {
    const existingCount = await prisma.discussionCategory.count({
      where: { communityId }
    });

    if (existingCount > 0) return;

    const seedStructure = [
      {
        name: "General",
        channels: [
          { name: "introductions", slug: "introductions", description: "Introduce yourself to the community!" },
          { name: "announcements", slug: "announcements", description: "Important community news and announcements." }
        ]
      },
      {
        name: "Development",
        channels: [
          { name: "frontend", slug: "frontend", description: "UI/UX, CSS, Tailwind, React, and Next.js discussions." },
          { name: "backend", slug: "backend", description: "Databases, API routes, security, and hosting." },
          { name: "ai", slug: "ai", description: "Machine learning, LLMs, prompt engineering, and AI tools." }
        ]
      },
      {
        name: "Help",
        channels: [
          { name: "support", slug: "support", description: "Got stuck? Ask fellow community developers for help." },
          { name: "feedback", slug: "feedback", description: "Share feedback or suggest features to improve the ecosystem." }
        ]
      }
    ];

    for (const catData of seedStructure) {
      const category = await prisma.discussionCategory.create({
        data: {
          name: catData.name,
          communityId,
        }
      });

      for (const chanData of catData.channels) {
        const channel = await prisma.discussionChannel.create({
          data: {
            name: chanData.name,
            slug: chanData.slug,
            description: chanData.description,
            categoryId: category.id,
            communityId,
          }
        });

        if (chanData.slug === "introductions") {
          const adminMember = await prisma.communityMember.findFirst({
            where: { communityId },
            select: { userId: true }
          });

          const authorId = adminMember?.userId;

          if (authorId) {
            const seedPost = await prisma.post.create({
              data: {
                title: "👋 Welcome to the Community! Introduce Yourself Here!",
                content: "Hello everyone! Welcome to our new developer community. Drop a comment below introducing yourself, sharing what you're working on, and listing your stack technologies. Let's build together!",
                authorId,
                communityId,
                channelId: channel.id,
              }
            });

            await prisma.comment.create({
              data: {
                content: "Hey there! Working on Next.js, Prisma, and Neon databases. Super excited to connect with you all!",
                authorId,
                postId: seedPost.id,
              }
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to seed community discussions structure:", error);
  }
}
