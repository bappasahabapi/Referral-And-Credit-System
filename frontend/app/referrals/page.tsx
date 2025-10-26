import { redirect } from "next/navigation";
import { readServerToken } from "../../lib/server/session";

type RefItem = {
  _id: string;
  status: "PENDING" | "CONVERTED";
  createdAt: string;
  referredUserId?: { email: string; name: string; createdAt: string };
};

export default async function ReferralsPage() {
  const token = readServerToken();
  if (!token) redirect("/login?next=/referrals");

  const res = await fetch(`${process.env.BACKEND_URL}/api/referrals`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) redirect("/login?next=/referrals");
  const data = await res.json();

  const items: RefItem[] = data.referrals || [];

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold mb-4">Your referrals</h1>
      <div className="space-y-2">
        {items.map((r) => (
          <div
            key={r._id}
            className="flex items-center justify-between border border-slate-800 rounded-xl p-3"
          >
            <div>
              <p className="text-sm text-slate-400">
                {r.referredUserId?.email} — {r.referredUserId?.name}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-lg text-xs ${
                r.status === "CONVERTED"
                  ? "bg-green-700/40 text-green-300"
                  : "bg-yellow-700/40 text-yellow-200"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-400 text-sm">No referrals yet.</p>
        )}
      </div>
    </div>
  );
}
