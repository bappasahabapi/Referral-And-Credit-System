"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";

type Session = { authenticated: boolean; user?: { id: string; email: string } };

export default function NavbarClient({
  initialSession,
}: {
  initialSession: Session;
}) {
  const [session, setSession] = useState<Session>(initialSession);

  async function refreshProfile() {
    try {
      const res = await fetch("/api/me/profile", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json(); 
      setSession(data);
    } catch {
    }
  }
  useEffect(() => {
    refreshProfile();
    const handler = () => refreshProfile();
    window.addEventListener("session:changed", handler);
    return () => window.removeEventListener("session:changed", handler);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold">
        FileSure
      </Link>
      <nav className="flex items-center gap-4 text-sm text-slate-300">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/referrals">Referrals</Link>
        <Link href="/purchase">Purchase</Link>
        {!session.authenticated ? (
          <Link
            href="/login"
            className="px-3 py-1 rounded-lg bg-brand hover:bg-brand-dark text-white"
          >
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">
              Hi, {session.user?.email}
            </span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
