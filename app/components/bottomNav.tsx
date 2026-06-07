"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { MdLeaderboard } from "react-icons/md"
import { CgClipboard } from "react-icons/cg"

export default function BottomNav() {
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        async function checkAdmin() {
            const name = localStorage.getItem("pulse_user_name")
            if (!name) return

            const { data } = await supabase
                .from("applicants")
                .select("is_admin")
                .ilike("full_name", name)
                .single()

            if (data?.is_admin === true) {
                setIsAdmin(true)
            }
        }

        checkAdmin()
    }, [])

    if (pathname === "/" || pathname === "/register") return null

    function navItem(href: string, label: string, icon: React.ReactNode) {
        const active = pathname === href
        return (
            <Link
                href={href}
                className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                    active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
            >
                <span className={`text-2xl ${active ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                    {icon}
                </span>
                {label}
            </Link>
        )
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-8 py-4 flex justify-around items-center z-40">
            {navItem("/leaderboard", "Leaderboard", <MdLeaderboard />)}
            {isAdmin && navItem("/results", "Results", <CgClipboard />)}
        </nav>
    )
}