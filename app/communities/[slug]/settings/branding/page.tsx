import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { canManageCommunityBranding } from "@/lib/community/permissions";
import BrandingSettingsClient from "./BrandingSettingsClient";

interface BrandingSettingsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandingSettingsPage({ params }: BrandingSettingsPageProps) {
  const { slug } = await params;

  const community = await prisma.community.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, banner: true, image: true },
  });

  if (!community) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/login?callbackUrl=/communities/${slug}/settings/branding`);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) redirect("/login");

  const allowed = await canManageCommunityBranding(user.id, community.id);
  if (!allowed) redirect(`/communities/${slug}`);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link
        href={`/communities/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#34629f] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to community
      </Link>

      <div className="space-y-1">
        <p className="text-[10px] font-extrabold text-[#34629f] uppercase tracking-widest">
          {community.name}
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Community branding
        </h1>
        <p className="text-sm text-slate-500">
          Upload a banner and logo. Images are stored on Cloudinary and saved to your community profile.
        </p>
      </div>

      <BrandingSettingsClient
        slug={community.slug}
        initialBanner={community.banner}
        initialLogo={community.image}
      />
    </div>
  );
}
