"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type AccountRole = "USER" | "AUTHOR";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("USER");
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await registerUser({
        email,
        username,
        password,
        role,
      });

      localStorage.setItem("accessToken", result.token);
      setUser(result.user);

      if (result.user.role === "AUTHOR") {
        router.push("/authors/me");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Ambient background glow accents */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Join Novel Verse and start reading or writing.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0z"
              />
            </svg>

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Type */}
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "USER"
                    ? "border-blue-500 bg-blue-500/10 text-slate-900 dark:text-white"
                    : "border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Reader</div>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Discover and read novels.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("AUTHOR")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "AUTHOR"
                    ? "border-blue-500 bg-blue-500/10 text-slate-900 dark:text-white"
                    : "border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Author</div>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Create and manage your novels.
                </p>
              </button>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="your_username"
              minLength={3}
              maxLength={30}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="At least 8 characters"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : role === "AUTHOR" ? (
              "Create author account"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 dark:text-blue-400 transition hover:text-blue-500 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}