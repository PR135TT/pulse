"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleLogin() {
        if (!name.trim()) return
        setLoading(true)
        setError("")

        const { data, error } = await supabase
            .from("applicants")
            .select("full_name, is_admin")
            .ilike("full_name", name.trim())
            .single()

        if (error || !data) {
            setError("Name not found. Please check and try again.")
            setLoading(false)
            return
        }

        localStorage.setItem("pulse_user_name", data.full_name)

        router.push("/leaderboard")
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col items-center justify-center px-4">

            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
                <p className="text-zinc-500 text-sm mt-2">Play Global Game Enterprise</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    onClick={() => router.push("/register")}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition"
                >
                    New user
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold py-3 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                    I already signed up
                </button>
            </div>

            {/* Modal overlay */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h2 className="text-lg font-bold mb-1">Welcome back</h2>
                        <p className="text-zinc-500 text-sm mb-5">Enter the name you registered with</p>

                        <div className="flex flex-col gap-3">
                            <input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setError("")
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                placeholder="Your full name"
                                className="border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 w-full"
                                autoFocus
                            />

                            {error && (
                                <p className="text-xs text-red-500">{error}</p>
                            )}

                            <button
                                onClick={handleLogin}
                                disabled={loading || !name.trim()}
                                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-40"
                            >
                                {loading ? "Checking..." : "Continue"}
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-xs text-zinc-400 hover:text-zinc-600 transition text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}