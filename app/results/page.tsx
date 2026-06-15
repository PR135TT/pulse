"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"

type Applicant = {
    id: string
    full_name: string
    score: number
    hide_score: boolean
}

export default function Results() {
    const [verified, setVerified] = useState(false)
    const [position, setPosition] = useState("")
    const [pin, setPin] = useState("")
    const [newPin, setNewPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    const [step, setStep] = useState<"position" | "create_pin" | "enter_pin">("position")
    const [authLoading, setAuthLoading] = useState(false)
    const [authError, setAuthError] = useState("")

    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState<string | null>(null)

    async function handlePositionSubmit() {
        if (!position.trim()) return
        setAuthLoading(true)
        setAuthError("")

        const { data, error } = await supabase
            .from("applicants")
            .select("is_admin, pin")
            .ilike("position", position.trim())
            .single()

        if (error || !data) {
            setAuthError("Position not found. Please check and try again.")
            setAuthLoading(false)
            return
        }

        if (!data.is_admin) {
            setAuthError("This position does not have admin access.")
            setAuthLoading(false)
            return
        }

        // no pin set yet — first login
        if (!data.pin) {
            setStep("create_pin")
        } else {
            setStep("enter_pin")
        }

        setAuthLoading(false)
    }

    async function handleCreatePin() {
        if (!newPin.trim() || !confirmPin.trim()) return
        setAuthError("")

        if (newPin !== confirmPin) {
            setAuthError("PINs do not match. Try again.")
            return
        }

        if (newPin.length < 4) {
            setAuthError("PIN must be at least 4 characters.")
            return
        }

        setAuthLoading(true)

        const { error } = await supabase
            .from("applicants")
            .update({ pin: newPin })
            .ilike("position", position.trim())

        if (error) {
            setAuthError("Failed to save PIN. Try again.")
            setAuthLoading(false)
            return
        }

        setVerified(true)
        setAuthLoading(false)
        fetchApplicants()
    }

    async function handleEnterPin() {
        if (!pin.trim()) return
        setAuthLoading(true)
        setAuthError("")

        const { data, error } = await supabase
            .from("applicants")
            .select("pin")
            .ilike("position", position.trim())
            .single()

        if (error || !data) {
            setAuthError("Something went wrong.")
            setAuthLoading(false)
            return
        }

        if (data.pin !== pin) {
            setAuthError("Incorrect PIN.")
            setAuthLoading(false)
            return
        }

        setVerified(true)
        setAuthLoading(false)
        fetchApplicants()
    }

    async function fetchApplicants() {
        setLoading(true)

        const { data, error } = await supabase
            .from("applicants")
            .select("id, full_name, score, hide_score")
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

    async function toggleHideScore(id: string, current: boolean) {
        const {error} = await supabase
            .from("applicants")
            .update({ hide_score: !current })
            .eq("id", id)

            if (error) {
                console.error(error)
                alert("Failed to update visibility.")
            } else {
                setApplicants(prev => prev.map(a => a.id === id? {...a, hide_score: !current} : a))
            }
    }

    const inputClass = "border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 w-full"
    const btnClass = "w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-40"

    if (!verified) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex items-center justify-center px-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border border-zinc-200 dark:border-zinc-800">

                    {step === "position" && (
                        <>
                            <h2 className="text-lg font-bold mb-1">Admin access</h2>
                            <p className="text-zinc-500 text-sm mb-5">Enter your position to continue</p>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={position}
                                    onChange={(e) => { setPosition(e.target.value); setAuthError("") }}
                                    onKeyDown={(e) => e.key === "Enter" && handlePositionSubmit()}
                                    placeholder="Your position"
                                    className={inputClass}
                                    autoFocus
                                />
                                {authError && <p className="text-xs text-red-500">{authError}</p>}
                                <button
                                    onClick={handlePositionSubmit}
                                    disabled={authLoading || !position.trim()}
                                    className={btnClass}
                                >
                                    {authLoading ? "Checking..." : "Continue"}
                                </button>
                            </div>
                        </>
                    )}

                    {step === "create_pin" && (
                        <>
                            <h2 className="text-lg font-bold mb-1">Create a PIN</h2>
                            <p className="text-zinc-500 text-sm mb-5">This is your first login. Set a PIN you will use every time.</p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="password"
                                    value={newPin}
                                    onChange={(e) => { setNewPin(e.target.value); setAuthError("") }}
                                    placeholder="Create PIN"
                                    className={inputClass}
                                    autoFocus
                                />
                                <input
                                    type="password"
                                    value={confirmPin}
                                    onChange={(e) => { setConfirmPin(e.target.value); setAuthError("") }}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreatePin()}
                                    placeholder="Confirm PIN"
                                    className={inputClass}
                                />
                                {authError && <p className="text-xs text-red-500">{authError}</p>}
                                <button
                                    onClick={handleCreatePin}
                                    disabled={authLoading || !newPin.trim() || !confirmPin.trim()}
                                    className={btnClass}
                                >
                                    {authLoading ? "Saving..." : "Set PIN and continue"}
                                </button>
                                <button
                                    onClick={() => { setStep("position"); setAuthError("") }}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 transition text-center"
                                >
                                    Go back
                                </button>
                            </div>
                        </>
                    )}

                    {step === "enter_pin" && (
                        <>
                            <h2 className="text-lg font-bold mb-1">Enter PIN</h2>
                            <p className="text-zinc-500 text-sm mb-5">Enter your admin PIN to unlock</p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => { setPin(e.target.value); setAuthError("") }}
                                    onKeyDown={(e) => e.key === "Enter" && handleEnterPin()}
                                    placeholder="Enter PIN"
                                    className={inputClass}
                                    autoFocus
                                />
                                {authError && <p className="text-xs text-red-500">{authError}</p>}
                                <button
                                    onClick={handleEnterPin}
                                    disabled={authLoading || !pin.trim()}
                                    className={btnClass}
                                >
                                    {authLoading ? "Verifying..." : "Confirm"}
                                </button>
                                <button
                                    onClick={() => { setStep("position"); setPin(""); setAuthError("") }}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 transition text-center"
                                >
                                    Go back
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        )
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
                                    <button
                                        onClick={() => updateScore(applicant.id, applicant.score, -1)}
                                        disabled={updating === applicant.id || applicant.score === 0}
                                        className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-lg font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition flex items-center justify-center shrink-0"
                                    >
                                        −
                                    </button>

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

                                    <button
                                        onClick={() => updateScore(applicant.id, applicant.score, 1)}
                                        disabled={updating === applicant.id}
                                        className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-lg font-bold hover:opacity-80 disabled:opacity-30 transition flex items-center justify-center shrink-0"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => toggleHideScore(applicant.id, applicant.hide_score)}
                                        className={`mt-3 w-full py-2 rounded-xl text-xs font-semibold border transition ${
                                            applicant.hide_score
                                                ? "border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {applicant.hide_score ? "Score hidden — tap to show" : "Tap to hide score"}
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