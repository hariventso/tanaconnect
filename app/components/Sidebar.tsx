"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  MoreHorizontal,
} from "lucide-react";

interface SidebarProps {
  username: string;
  avatar?: string | null;
}

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/search", icon: Search, label: "Rechercher" },
  { href: "/explore", icon: Compass, label: "Explorer" },
  { href: "/reels", icon: Film, label: "Reels" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/notifications", icon: Heart, label: "Notifications" },
  { href: "/create", icon: PlusSquare, label: "Créer" },
];

export default function Sidebar({ username, avatar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-800 bg-black px-3 py-6">
      {/* Logo */}
      <div className="px-3 py-4 mb-4">
        <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Billabong', cursive" }}>
          TanaConnect
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition-all hover:bg-neutral-900 ${
                isActive ? "font-bold" : "text-neutral-300"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${isActive ? "text-white" : "text-neutral-300"}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={isActive ? "text-white" : "text-neutral-200"}>{label}</span>
            </Link>
          );
        })}

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition-all hover:bg-neutral-900 ${
            pathname === "/profile" ? "font-bold" : "text-neutral-300"
          }`}
        >
          {avatar ? (
            <img src={avatar} alt="avatar" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 text-xs font-bold text-white ring-2 ring-neutral-800">
              {username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <span className={pathname === "/profile" ? "text-white" : "text-neutral-200"}>Profil</span>
        </Link>
      </nav>

      {/* More / Logout */}
      <div className="mt-auto">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-900"
          >
            <MoreHorizontal className="h-6 w-6" strokeWidth={1.5} />
            <span>Plus</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
