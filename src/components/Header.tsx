"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CircleUserRound, LogOut, Menu } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const navItems = [
  { href: "/", label: "Symptom Analysis" },
  { href: "/map?type=hospital", label: "Nearby Hospitals" },
  { href: "/map?type=pharmacy", label: "Nearby Pharmacies" },
  { href: "/history", label: "Search History" }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const id = window.setTimeout(() => setAuthReady(true), 0);
      return () => window.clearTimeout(id);
    }

    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
        setAuthReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-5">
        <Link href="/" className="text-2xl font-extrabold tracking-normal text-teal-800">
          MediMap AI
        </Link>
        <nav aria-label="주요 메뉴" className="hidden flex-1 items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" || pathname.startsWith("/symptom") || pathname.startsWith("/analysis") : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <CircleUserRound aria-hidden="true" className="size-6 text-slate-900" />
          {authReady && user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="max-w-44 truncate text-sm font-bold text-slate-700">{user.email}</span>
              <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-full bg-teal-800 px-7 py-3 text-base font-bold text-white shadow-sm md:inline-flex">
              Login
            </Link>
          )}
          <button className="rounded-full border border-slate-300 p-2 md:hidden" aria-label="메뉴 열기">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
