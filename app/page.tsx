import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { db } from "@/app/lib/db";
import Sidebar from "@/app/components/Sidebar";
import Stories from "@/app/components/Stories";
import PostCard from "@/app/components/PostCard";
import RightSidebar from "@/app/components/RightSidebar";
import { Camera } from "lucide-react";

export const metadata = {
  title: "TanaConnect — Accueil",
  description: "Votre fil d'actualité TanaConnect",
};

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentUser = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, username: true, avatar: true, email: true },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Get users that current user follows
  const following = await db.follow.findMany({
    where: { followerId: currentUser.id },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  // Fetch feed posts (from followed users + own posts)
  const posts = await db.post.findMany({
    where: {
      authorId: { in: [...followingIds, currentUser.id] },
    },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: currentUser.id }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Map isLiked
  const postsWithLiked = posts.map((p) => ({
    ...p,
    isLiked: p.likes.length > 0,
  }));

  // Active stories (not expired, not from current user)
  const stories = await db.story.findMany({
    where: {
      expiresAt: { gt: new Date() },
      userId: { in: followingIds },
    },
    include: {
      user: { select: { name: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Suggestions: users not followed, not self
  const suggestions = await db.user.findMany({
    where: {
      id: { notIn: [...followingIds, currentUser.id] },
    },
    select: { id: true, name: true, username: true, avatar: true },
    take: 5,
  });

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Sidebar */}
      <Sidebar username={currentUser.username || currentUser.name || "moi"} avatar={currentUser.avatar} />

      {/* Main Content */}
      <main className="ml-64 flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-[470px]">
          {/* Stories */}
          <Stories
            stories={stories}
            currentUser={{ name: currentUser.name, username: currentUser.username, avatar: currentUser.avatar }}
          />

          {/* Feed */}
          {postsWithLiked.length > 0 ? (
            <div className="space-y-1">
              {postsWithLiked.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700">
                <Camera className="h-10 w-10 text-neutral-600" strokeWidth={1} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Bienvenue sur TanaConnect !</h2>
              <p className="text-neutral-400 text-sm max-w-xs mb-6 leading-relaxed">
                Suivez des personnes pour voir leurs photos et vidéos ici. Commencez à explorer la communauté.
              </p>
              <button className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
                Découvrir des personnes
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="ml-16 hidden xl:block">
          <RightSidebar currentUser={currentUser} suggestions={suggestions} />
        </div>
      </main>
    </div>
  );
}
