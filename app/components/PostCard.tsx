"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toggleLike } from "@/app/actions/post";

interface PostCardProps {
  post: {
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      username: string | null;
      avatar: string | null;
    };
    _count: { likes: number; comments: number };
    isLiked: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [saved, setSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  async function handleLike() {
    setIsAnimating(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    await toggleLike(post.id);
    setTimeout(() => setIsAnimating(false), 400);
  }

  function handleDoubleClick() {
    if (!liked) handleLike();
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const displayName = post.author.username || post.author.name || "utilisateur";

  return (
    <article className="border-b border-neutral-800 pb-4 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="rounded-full p-[2px] bg-black">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 text-sm font-bold text-white">
                  {displayName[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{displayName}</p>
            <p className="text-xs text-neutral-500">{timeAgo}</p>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-white transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative overflow-hidden rounded-sm"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={post.imageUrl}
          alt={post.caption || "post"}
          className="w-full object-cover max-h-[585px]"
        />
        {/* Double-tap heart animation */}
        {isAnimating && liked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="h-24 w-24 fill-white text-white opacity-90 animate-ping" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="transition-transform hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-white"
              }`}
              strokeWidth={liked ? 0 : 1.5}
            />
          </button>
          <button className="transition-transform hover:scale-110">
            <MessageCircle className="h-6 w-6 text-white" strokeWidth={1.5} />
          </button>
          <button className="transition-transform hover:scale-110">
            <Send className="h-6 w-6 text-white" strokeWidth={1.5} />
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className="transition-transform hover:scale-110">
          <Bookmark
            className={`h-6 w-6 transition-colors ${saved ? "fill-white text-white" : "text-white"}`}
            strokeWidth={saved ? 0 : 1.5}
          />
        </button>
      </div>

      {/* Like count */}
      <div className="px-1 pt-2">
        <p className="text-sm font-semibold text-white">
          {likeCount.toLocaleString("fr-FR")} {likeCount <= 1 ? "J'aime" : "J'aimes"}
        </p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-1 pt-1">
          <p className="text-sm text-white">
            <span className="font-semibold mr-2">{displayName}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments count */}
      {post._count.comments > 0 && (
        <div className="px-1 pt-1">
          <button className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
            Voir les {post._count.comments} commentaires
          </button>
        </div>
      )}
    </article>
  );
}
