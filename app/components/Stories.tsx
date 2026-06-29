"use client";


interface Story {
  id: string;
  user: { name: string | null; username: string | null; avatar: string | null };
  imageUrl: string;
}

interface StoriesProps {
  stories: Story[];
  currentUser: { name: string | null; username: string | null; avatar: string | null };
}

const GRADIENT_COLORS = [
  "from-yellow-400 via-pink-500 to-purple-600",
  "from-orange-400 via-red-500 to-pink-600",
  "from-blue-400 via-cyan-500 to-teal-400",
  "from-green-400 via-emerald-500 to-cyan-500",
  "from-violet-500 via-purple-600 to-pink-500",
];

function StoryAvatar({ name, avatar, index }: { name: string | null; avatar: string | null; index: number }) {
  const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
  return (
    <div className={`p-[2px] rounded-full bg-gradient-to-tr ${gradient}`}>
      <div className="rounded-full p-[2px] bg-black">
        {avatar ? (
          <img src={avatar} alt={name || "story"} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-lg font-bold text-white`}>
            {name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Stories({ stories, currentUser }: StoriesProps) {
  return (
    <div className="mb-6 w-full overflow-x-auto rounded-xl border border-neutral-800 bg-black px-4 py-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max">
        {/* Votre story */}
        <button
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-neutral-600 bg-neutral-900 text-2xl text-neutral-400 group-hover:border-neutral-400 transition-colors">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="you" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">
                  {currentUser.name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white ring-2 ring-black">
              +
            </div>
          </div>
          <span className="w-16 truncate text-center text-xs text-neutral-300">Votre story</span>
        </button>

        {/* Stories des autres */}
        {stories.length > 0 ? (
          stories.map((story, i) => (
            <button
              key={story.id}
              className="flex flex-col items-center gap-1.5"
            >
              <StoryAvatar name={story.user.name} avatar={story.user.avatar} index={i} />
              <span className="w-16 truncate text-center text-xs text-neutral-300">
                {story.user.username || story.user.name || "utilisateur"}
              </span>
            </button>
          ))
        ) : (
          // Démos stories quand vide
          [
            { name: "Sophie", color: 0 },
            { name: "Lucas", color: 1 },
            { name: "Emma", color: 2 },
            { name: "Hugo", color: 3 },
            { name: "Léa", color: 4 },
          ].map((u) => (
            <button key={u.name} className="flex flex-col items-center gap-1.5 opacity-40 cursor-default" disabled>
              <StoryAvatar name={u.name} avatar={null} index={u.color} />
              <span className="w-16 truncate text-center text-xs text-neutral-300">{u.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
