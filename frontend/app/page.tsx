"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-semibold">
          Referral & Credit System
        </h1>
        <p className="text-slate-300">
          Register, share your link, earn credits on your friends&apos; first
          purchase, and track everything on a clean dashboard.
        </p>
        <div className="flex gap-3">
          <Link className="btn text-white" href="/register">
            Get Started
          </Link>
          <Link
            className="btn text-white bg-slate-700 hover:bg-slate-600"
            href="/login"
          >
            Login
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <h3 className="font-semibold mb-2">Demo credentials</h3>
        <p className="text-sm text-slate-300">
          Use seeded user like <code>lina@example.com</code> /{" "}
          <code>lina123</code> to explore.
        </p>
      </motion.div>
    </div>
  );
}
