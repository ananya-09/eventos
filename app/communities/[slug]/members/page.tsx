import { headers } from "next/headers";
import MembersList from "@/app/communities/[slug]/members/MembersList";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  joinedAt: string;
  role: string;
};

export default async function MembersPage(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let members: Member[] = [];
  let count = 0;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const membersRes = await fetch(`${baseUrl}/api/communities/${slug}/members`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    if (membersRes.ok) {
      const data = await membersRes.json();
      if (data.success) {
        members = data.members || [];
        count = data.count || 0;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch members for page ${slug}:`, error);
  }

  return (
    <div className="w-full">
      <MembersList initialMembers={members} initialCount={count} />
    </div>
  );
}
