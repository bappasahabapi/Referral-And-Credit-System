"use client";
import { useState } from "react";
import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { api } from "../../lib/api";
import { useToast } from "../../components/ToastProvider";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

export default function RegisterPage() {
  const { show } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref");

  async function onSubmit(form: FormData) {
    setError(null);
    setLoading(true);
    const values = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      referralCode: String(form.get("referralCode") || ref || ""),
    };
    const parse = schema.safeParse(values);
    if (!parse.success) {
      setError(parse.error.errors[0].message);
      setLoading(false);
      return;
    }

    const res = await api.register(parse.data);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      show(res.error, "error");
      return;
    }
    show("Account created", "success");
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto card p-6"
    >
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <form action={onSubmit} className="space-y-3">
        <input name="name" placeholder="Name" className="input" />
        <input name="email" placeholder="Email" className="input" />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="input"
        />
        <input
          name="referralCode"
          placeholder="Referral Code (optional)"
          defaultValue={ref || ""}
          className="input"
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </motion.div>
  );
}
