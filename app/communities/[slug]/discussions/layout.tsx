import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageChannels } from "@/lib/discussions/permissions";
import { getCommunityDiscussionCategories } from "@/lib/discussions/queries";
import ChannelSidebar from "@/app/communities/[slug]/discussions/components/ChannelSidebar";

interface DiscussionsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DiscussionsLayout({
  children,
  params,
}: DiscussionsLayoutProps) {
  const { slug } = await params;

  // Hydrate all categories and subchannels from Postgres aggregates
  const categories = await getCommunityDiscussionCategories(slug);

  const session = await getServerSession(authOptions);
  let isManager = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (user && community) {
      isManager = await canManageChannels(user.id, community.id);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full">
      {/* Sticky Left Category Directories Sidebar Column */}
      <aside className="lg:col-span-1 lg:sticky lg:top-24 w-full">
        <ChannelSidebar categories={categories} slug={slug} isManager={isManager} />
      </aside>

      {/* Main Forum Content Frame Column */}
      <main className="lg:col-span-3 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
