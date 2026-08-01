import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateCommunityClient from "./CreateCommunityClient";

export const metadata = {
  title: "Create a Community | Eventos",
  description: "Start a brand new premium community on Eventos to share events, updates, and discussions.",
};

interface CreateCommunityPageProps {
  searchParams: Promise<{ name?: string }>;
}

export default async function CreateCommunityPage({ searchParams }: CreateCommunityPageProps) {
  // 1. Route-level authentication check
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    // If not authenticated, redirect to login page with callback URL
    redirect("/login?callbackUrl=/communities/new");
  }

  // 2. Pre-fill community name if provided in search queries (e.g. from empty states)
  const resolvedSearchParams = await searchParams;
  const initialName = resolvedSearchParams.name || "";

  return (
    <div className="relative w-full min-h-screen">
      {/* Premium ambient backdrop light */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#34629f]/5 rounded-full blur-[130px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
        <CreateCommunityClient initialName={initialName} />
      </div>
    </div>
  );
}
