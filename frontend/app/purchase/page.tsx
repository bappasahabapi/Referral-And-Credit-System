"use client";
import { useState } from "react";
import { z } from "zod";
import { api } from "../../lib/api";
import { useToast } from "../../components/ToastProvider";

const schema = z.object({ amount: z.coerce.number().positive() });

export default function PurchasePage() {
  const { show } = useToast();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(form: FormData) {
    setMsg(null);
    setError(null);
    setLoading(true);
    const amountStr = String(form.get("amount") || "");
    const parsed = schema.safeParse({ amount: amountStr });
    if (!parsed.success) {
      setError("Amount must be a positive number");
      setLoading(false);
      return;
    }

    const res = await api.purchase(parsed.data.amount);
    if (!res.ok) {
      setError(res.error);
      show(res.error, "error");
    } else {
      setMsg("Purchase recorded successfully.");
      show("Purchase recorded", "success");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md card p-6 mx-auto">
      <h1 className="text-xl font-semibold mb-4">Simulate Purchase</h1>
      {msg && <p className="text-green-400 text-sm mb-2">{msg}</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <form action={onSubmit} className="space-y-3">
        <input name="amount" placeholder="Amount" className="input" />
        <button className="btn w-full" disabled={loading}>
          {loading ? "Processing..." : "Buy"}
        </button>
      </form>
      <p className="text-xs text-slate-400 mt-3">
        Note: Only your <b>first</b> purchase triggers referral credits.
      </p>
    </div>
  );
}
