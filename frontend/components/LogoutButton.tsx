"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function doLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }
  return (
    <button
      onClick={doLogout}
      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
    >
      Logout
    </button>
  );
}
