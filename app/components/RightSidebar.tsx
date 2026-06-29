import Link from "next/link";
import { UserPlus } from "lucide-react";

interface SuggestionUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  reason?: string;
}

interface RightSidebarProps {
  currentUser: {
    name: string | null;
    username: string | null;
    avatar: string | null;
    email: string;
  };
  suggestions: SuggestionUser[];
}

const DEMO_SUGGESTIONS: SuggestionUser[] = [
  { id: "d1", name: "Sophie Martin", username: "sophiemartin", avatar: null, reason: "Suggéré pour vous" },
  { id: "d2", name: "Lucas Bernard", username: "lucas_b", avatar: null, reason: "Suivi par thomas_r" },
  { id: "d3", name: "Emma Dubois", username: "emmadubois", avatar: null, reason: "Nouveau sur TanaConnect" },
  { id: "d4", name: "Hugo Petit", username: "hugo_petit", avatar: null, reason: "Suggéré pour vous" },
];

const AVATAR_COLORS = [
  "from-pink-500 to-rose-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-yellow-500 to-orange-600",
];

export default function RightSidebar({ currentUser, suggestions }: RightSidebarProps) {
  const displayName = currentUser.username || currentUser.name || "utilisateur";
  const allSuggestions = suggestions.length > 0 ? suggestions : DEMO_SUGGESTIONS;

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-8 space-y-6">
        {/* Current User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={displayName} className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 text-sm font-bold text-white">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{displayName}</p>
              <p className="text-xs text-neutral-400 truncate max-w-[150px]">{currentUser.name || currentUser.email}</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Voir
          </Link>
        </div>

        {/* Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-neutral-400">Suggestions pour vous</p>
            <Link href="/explore" className="text-xs font-semibold text-white hover:text-neutral-300 transition-colors">
              Voir tout
            </Link>
          </div>

          <div className="space-y-3">
            {allSuggestions.map((user, i) => {
              const name = user.name || user.username || "Utilisateur";
              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-xs font-bold text-white`}>
                        {name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-white leading-tight">
                        {user.username || name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {user.reason || "Suggéré pour vous"}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    <UserPlus className="h-3.5 w-3.5" />
                    Suivre
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2">
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            À propos · Aide · Presse · API · Emplois · Confidentialité · Conditions
          </p>
          <p className="text-[11px] text-neutral-700">© 2026 TanaConnect</p>
        </div>
      </div>
    </aside>
  );
}
