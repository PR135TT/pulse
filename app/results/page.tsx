"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Applicant = {
    id: string
    full_name: string
    score: number
}

export default function Results() {
    const router = useRouter()
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            const name = localStorage.getItem("pulse_user_name")

            if (!name) {
                router.replace("/")
                return
            }

            const { data } = await supabase
                .from("applicants")
                .select("is_admin")
                .ilike("full_name", name)
                .single()

            if (!data?.is_admin) {
                router.replace("/")
                return
            }

            await fetchApplicants()
        }

        init()
    }, [])

    async function fetchApplicants() {
        const { data, error } = await supabase
            .from("applicants")
            .select("id, full_name, score")
            .order("score", { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setApplicants(data ?? [])
        }

        setLoading(false)
    }

    async function updateScore(id: string, currentScore: number, delta: number) {
        const newScore = Math.max(0, currentScore + delta)
        setUpdating(id)

        const { error } = await supabase
            .from("applicants")
            .update({ score: newScore })
            .eq("id", id)

        if (error) {
            console.error(error)
            alert("Failed to update score.")
        } else {
            setApplicants(prev =>
                [...prev.map(a => a.id === id ? { ...a, score: newScore } : a)]
                    .sort((a, b) => b.score - a.score)
            )
        }

        setUpdating(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <p className="text-zinc-400 text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans px-4 py-10 pb-28">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Results</h1>
                    <p className="text-zinc-500 text-sm mt-1">Update weekly scores</p>
                </div>

                {applicants.length === 0 ? (
                    <div className="text-center py-20 text-zinc-400 text-sm">
                        No applicants found.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {applicants.map((applicant) => (
                            <div
                                key={applicant.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-semibold text-sm">{applicant.full_name}</p>
                                    <span className="text-xl font-bold">
                                        {applicant.score}
                                        <span className="text-xs font-normal text-zinc-400 ml-1">pts</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">

                                    {/* Subtract button */}
                                    <button
                                        onClick={() => updateScore(applicant.id, applicant.score, -1)}
                                        disabled={updating === applicant.id || applicant.score === 0}
                                        className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-lg font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition flex items-center justify-center shrink-0"
                                    >
                                        −
                                    </button>

                                    {/* Quick add buttons */}
                                    <div className="flex gap-2 flex-1">
                                        {[1, 2, 4, 8].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => updateScore(applicant.id, applicant.score, val)}
                                                disabled={updating === applicant.id}
                                                className="flex-1 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition"
                                            >
                                                +{val}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Add button */}
                                    <button
                                        onClick={() => updateScore(applicant.id, applicant.score, 1)}
                                        disabled={updating === applicant.id}
                                        className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-lg font-bold hover:opacity-80 disabled:opacity-30 transition flex items-center justify-center shrink-0"
                                    >
                                        +
                                    </button>
                                </div>

                                {updating === applicant.id && (
                                    <p className="text-xs text-zinc-400 mt-2 text-right">Saving...</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}