import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== DIAGNOSING DATABASE ===");
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => ({ id: u.id, name: u.name, email: u.email })));

  const communities = await prisma.community.findMany();
  console.log("Communities:", communities.map(c => ({ id: c.id, name: c.name, slug: c.slug, creatorId: c.creatorId })));

  const memberships = await prisma.communityMember.findMany();
  console.log("Memberships:", memberships);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
