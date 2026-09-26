"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 overflow-x-hidden flex flex-col justify-between transition-colors duration-200">
      {/* Background artwork covering the hero area */}
      <div className="absolute top-0 left-0 right-0 h-[700px] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50 dark:via-[#060913]/60 dark:to-[#060913] z-10" />
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
          alt="Fantasy landscape background"
          sizes="100vw"
          className="w-full h-full object-cover opacity-30 dark:opacity-60 scale-105 filter brightness-90 dark:brightness-75 transition-opacity"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center px-6 pt-12 pb-24">
        {/* Top Feature Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-inner shadow-purple-500/10">
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-mono">
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
            |||||...||||
          </span>
          <span>Now with AI Voices</span>
          <span className="rounded bg-amber-400/20 border border-amber-400/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300 tracking-wider">
            NEW
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-slate-900 dark:text-white max-w-4xl">
          Create Interactive Stories Powered by AI
        </h1>

        {/* Subtitle description */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300/90 font-light">
          Craft Personalized Content, Engage with Your Characters, and Bring
          Stories to Life with AI Magic Slides!
        </p>

        {/* Action Button & Disclaimer */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/novels"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            Get started for Free
          </Link>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-light tracking-wide">
            No credit card needed
          </span>
        </div>

        {/* Dynamic Authenticated Quick Actions */}
        <div className="mt-6 flex items-center gap-4">
          {user?.role === "AUTHOR" ? (
            <Link
              href="/authors/me"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Open Author Studio &rarr;
            </Link>
          ) : user ? (
            <Link
              href="/novels"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
            >
              Continue reading &rarr;
            </Link>
          ) : (
            <Link
              href="/register"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
            >
              Create account &rarr;
            </Link>
          )}
        </div>
      </section>

      {/* Secondary Information Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Experience The World&apos;s Best Platform for AI-Powered Storytelling
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light">
          Embark on a journey where you tailor each story to your imagination!
          With StoryNest.ai, customize characters, settings, and storylines,
          turning every narrative into your personal adventure. Now, we&apos;re
          elevating the experience. Our latest feature, Magic Slides, transforms
          your stories into immersive audiobooks with AI-generated voices and
          animated image slides. You&apos;re not just a reader, but the
          architect and director of your captivating sagas. Unleash...
        </p>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#04060b] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NovelVerse.ai. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {/* X (Twitter) */}
            <a
              href="https://x.com/jaysofty_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/adekunle-abowaba-09a2701b4/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/kunlele.kunzy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
