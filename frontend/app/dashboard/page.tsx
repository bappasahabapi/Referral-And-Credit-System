import { redirect } from "next/navigation";
import CopyButton from "../../components/CopyButton";
import { readServerToken } from "../../lib/server/session";

type Dash = {
  totalReferredUsers: number;
  referredUsersWhoPurchased: number;
  totalCreditsEarned: number;
  referralLink: string;
};

export default async function DashboardPage() {
  const token = readServerToken();
  if (!token) redirect("/login?next=/dashboard");

  const res = await fetch(`${process.env.BACKEND_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    redirect("/login?next=/dashboard");
  }
  const data: Dash = await res.json();

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card p-6">
        <p className="text-slate-400 text-sm">Referred Users</p>
        <p className="text-3xl font-semibold">{data.totalReferredUsers}</p>
      </div>
      <div className="card p-6">
        <p className="text-slate-400 text-sm">Converted Users</p>
        <p className="text-3xl font-semibold">
          {data.referredUsersWhoPurchased}
        </p>
      </div>
      <div className="card p-6">
        <p className="text-slate-400 text-sm">Total Credits</p>
        <p className="text-3xl font-semibold">{data.totalCreditsEarned}</p>
      </div>
      <div className="md:col-span-3 card p-6">
        <p className="text-slate-400 text-sm mb-2">Your referral link</p>
        <div className="flex gap-2">
          <input readOnly value={data.referralLink} className="input" />
          {/* CopyButton is a client component so it can safely have event handlers */}
          <CopyButton text={data.referralLink} />
        </div>
      </div>
    </div>
  );
}
