import { CategoryWithChannels, ChannelPost, ChannelOverview, ThreadReply, Creator } from "./types";

export function serializeCategoryWithChannels(categories: any[]): CategoryWithChannels[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    channels: cat.channels.map((chan: any) => ({
      id: chan.id,
      name: chan.name,
      slug: chan.slug,
      description: chan.description,
      categoryId: chan.categoryId,
      communityId: chan.communityId,
      postsCount: chan._count?.posts || 0,
    })),
  }));
}

export function serializeThreadReply(reply: any): ThreadReply {
  return {
    id: reply.id,
    content: reply.content,
    createdAt: reply.createdAt.toISOString(),
    author: {
      id: reply.author.id,
      name: reply.author.name,
      image: reply.author.image,
    },
    postId: reply.postId,
  };
}

export function serializeChannelPost(post: any): ChannelPost {
  const dbComments = post.comments || [];
  const serializedReplies = dbComments.map(serializeThreadReply);

  // Compute activity presence metrics in-memory (N+1 free)
  const latestComment = dbComments[dbComments.length - 1] || null;
  const latestReplyAt = latestComment ? latestComment.createdAt.toISOString() : post.createdAt.toISOString();
  
  const latestReplyUser = latestComment ? {
    id: latestComment.author.id,
    name: latestComment.author.name,
    image: latestComment.author.image,
  } : undefined;

  // Extract unique participants
  const participantsMap = new Map<string, Creator>();
  dbComments.forEach((comm: any) => {
    participantsMap.set(comm.author.id, {
      id: comm.author.id,
      name: comm.author.name,
      image: comm.author.image,
    });
  });
  const participants = Array.from(participantsMap.values());

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    likesCount: post._count?.likes || 0,
    commentsCount: post._count?.comments || 0,
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
    },
    channelId: post.channelId,
    replies: serializedReplies,
    latestReplyAt,
    latestReplyUser,
    participants,
  };
}

export function serializeChannelOverview(chan: any): ChannelOverview {
  return {
    id: chan.id,
    name: chan.name,
    slug: chan.slug,
    description: chan.description,
    categoryId: chan.categoryId,
    communityId: chan.communityId,
  };
}
