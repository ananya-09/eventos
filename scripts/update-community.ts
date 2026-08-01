import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating community name...");

  // Update name of the community with slug 'web-developers' or name containing 'web'
  const result = await prisma.community.updateMany({
    where: {
      OR: [
        { slug: "web-developers" },
        { name: "Web Developers" }
      ]
    },
    data: {
      name: "Google Developers Group,MMMUT"
    }
  });

  console.log(`Updated ${result.count} communities successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
