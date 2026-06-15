"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

type Applicant = {
    id: string
    full_name: string
    position: string
    department: string
    score: number
    hide_score: boolean
    last_score: number
}

export default function Leaderboard() {
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data, error } = await supabase
                .from("applicants")
                .select("id, full_name, position, department, score, hide_score, last_score")
                .order("score", { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setApplicants(data ?? [])
            }

            setLoading(false)
        }

        fetchLeaderboard()
    }, [])

    function getRankStyle(index: number) {
        if (index === 0) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        if (index === 1) return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        if (index === 2) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        return "bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600"
    }

    function getRankLabel(index: number) {
        if (index === 0) return "🥇"
        if (index === 1) return "🥈"
        if (index === 2) return "🥉"
        return `#${index + 1}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <p className="text-zinc-400 text-sm">Loading leaderboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans px-4 py-10">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Leaderboard</h1>
                    <p className="text-zinc-500 text-sm mt-1">Pulse Play Global Game Enterprise</p>
                </div>

                {applicants.length === 0 ? (
                    <div className="text-center py-20 text-zinc-400 text-sm">
                        No applicants yet.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pb-12">
                        {applicants.map((applicant, index) => (
                            <div
                                key={applicant.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-4"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getRankStyle(index)}`}>
                                    {getRankLabel(index)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{applicant.full_name}</p>
                                    <p className="text-xs text-zinc-400 truncate">
                                        {applicant.position || "—"} · {applicant.department || "—"}
                                    </p>
                                    {applicant.last_score > 0 && (
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            Last week: {applicant.hide_score ? "•••" : applicant.last_score} passes
                                        </p>
                                    )}
                                </div>
                                
                                <div className="text-right shrink-0">
                                    <p className="text-xl font-bold">
                                        {applicant.hide_score ? "•••" : applicant.score}
                                    </p>
                                    <p className="text-xs text-zinc-400">passes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}