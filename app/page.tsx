"use client"

import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col items-center justify-center px-4">

            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
                <p className="text-zinc-500 text-sm mt-2">Pulse Play Global Game Enterprise</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    onClick={() => router.push("/register")}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition"
                >
                    New user
                </button>
                <button
                    onClick={() => router.push("/leaderboard")}
                    className="w-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold py-3 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                    I already signed up
                </button>
            </div>
        </div>
    )
}