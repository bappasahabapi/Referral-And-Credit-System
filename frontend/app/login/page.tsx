"use client";
import { useState } from "react";
import { z } from "zod";
import { api } from "../../lib/api";
import { useToast } from "../../components/ToastProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const { show } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(form: FormData) {
    setError(null);
    setLoading(true);
    const values = {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    };
    const parse = schema.safeParse(values);
    if (!parse.success) {
      setError(parse.error.errors[0].message);
      setLoading(false);
      return;
    }

    const res = await api.login(parse.data);
    if (res.ok) {
      try {
        window.dispatchEvent(new Event("session:changed"));
      } catch {}
      router.push("/dashboard");
    }
    if (!res.ok) {
      setError(res.error);
      show(res.error, "error");
      setLoading(false);
      return;
    }
    show("Logged in successfully", "success");
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto card p-6"
    >
      <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <form action={onSubmit} className="space-y-3">
        <input name="email" placeholder="Email" className="input" />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="input"
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </motion.div>
  );
}
