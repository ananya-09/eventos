import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Components
import ThreadContainer from "./components/ThreadContainer";
import ThreadHeader from "./components/ThreadHeader";
import ThreadContent from "./components/ThreadContent";
import ThreadActions from "./components/ThreadActions";
import CommentSection from "./components/CommentSection";

interface ThreadPageProps {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata(
  props: ThreadPageProps
): Promise<Metadata> {
  const { slug, threadId } = await props.params;

  const post = await prisma.post.findUnique({
    where: { id: threadId },
    select: {
      title: true,
      content: true,
      community: {
        select: { name: true },
      },
    },
  });

  if (!post) {
    return {
      title: "Discussion Not Found - Eventos",
    };
  }

  return {
    title: `${post.title} | ${post.community.name} Discussions`,
    description: post.content.substring(0, 155) + "...",
  };
}

export default async function ThreadDetailPage(props: ThreadPageProps) {
  const { slug, threadId } = await props.params;

  // 1. Get current user session
  const session = await getServerSession(authOptions);
  let currentUser = null;

  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
  }

  // 2. Fetch the thread with author, community and comments in a single round-trip
  const post = await prisma.post.findUnique({
    where: { id: threadId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      comments: {
        where: { parentId: null },
        take: 11,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
          ...(currentUser ? {
            votes: {
              where: { userId: currentUser.id },
              select: { value: true },
            },
          } : {}),
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  // 3. Prevent cross-slug spoofing / check if thread exists
  if (!post || post.community.slug !== slug) {
    notFound();
  }

  // 4. Check if current user has liked or bookmarked this post
  let isLiked = false;
  let isBookmarked = false;
  let isWatched = false;
  let isMuted = false;

  if (currentUser) {
    const [likeRecord, bookmarkRecord, subRecord] = await Promise.all([
      prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: currentUser.id,
            postId: threadId,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: currentUser.id,
            postId: threadId,
          },
        },
      }),
      prisma.subscription.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: currentUser.id,
            targetType: "THREAD",
            targetId: threadId,
          },
        },
      }),
    ]);

    isLiked = !!likeRecord;
    isBookmarked = !!bookmarkRecord;
    isWatched = subRecord?.type === "WATCH";
    isMuted = subRecord?.type === "MUTE";
  }

  const initialRootComments = post.comments.map((comment: any) => {
    const userVoteRecord = currentUser && comment.votes && comment.votes[0] ? comment.votes[0] : null;
    const userVote = userVoteRecord ? userVoteRecord.value : null;
    const { votes, ...rest } = comment;
    return {
      ...rest,
      userVote,
    };
  });
  let initialNextCursor: string | null = null;
  if (initialRootComments.length > 10) {
    const nextItem = initialRootComments.pop();
    initialNextCursor = nextItem.id;
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      <ThreadContainer>
        {/* Thread Header: Author, lock/pin states, timestamp, breadcrumbs */}
        <ThreadHeader
          title={post.title}
          author={post.author}
          createdAt={post.createdAt}
          communitySlug={post.community.slug}
          communityName={post.community.name}
          pinned={post.pinned}
          locked={post.locked}
        />

        {/* Thread Content: Render markdown with code copy-paste */}
        <ThreadContent content={post.content} />

        {/* Thread Actions: Like, Comment count, Bookmark, Share */}
        <ThreadActions
          postId={post.id}
          initialLikesCount={post._count.likes}
          initialCommentsCount={post._count.comments}
          initialIsLiked={isLiked}
          initialIsBookmarked={isBookmarked}
          initialIsWatched={isWatched}
          initialIsMuted={isMuted}
          isLocked={post.locked}
        />

        {/* Separator before comments */}
        <div className="w-full h-[1px] bg-slate-150/80 dark:bg-slate-800/50" />

        {/* Recursive Comment Section */}
        <CommentSection
          postId={post.id}
          initialComments={initialRootComments}
          initialNextCursor={initialNextCursor}
          isThreadLocked={post.locked}
        />
      </ThreadContainer>
    </div>
  );
}
