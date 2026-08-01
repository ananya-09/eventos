import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Restoring Shaurya's membership in web-developers community...");
  const user = await prisma.user.findFirst({
    where: { email: "shauryasrivastav07@gmail.com" }
  });

  const community = await prisma.community.findFirst({
    where: { slug: "web-developers" }
  });

  if (user && community) {
    const existing = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: community.id
        }
      }
    });

    if (!existing) {
      await prisma.communityMember.create({
        data: {
          userId: user.id,
          communityId: community.id,
          role: "ADMIN"
        }
      });
      console.log("Successfully restored membership as ADMIN!");
    } else {
      console.log("Membership already exists.");
    }
  } else {
    console.log("User or Community not found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
