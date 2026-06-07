"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "",
        state_of_origin: "",
        nationality: "",
        marital_status: "",
        residential_address: "",
        phone_number: "",
        email: "",
        position: "",
        department: "",
        expected_salary: "",
        education: "",
        work_experience: "",
        skills_qualifications: "",
        referee_name: "",
        referee_phone: "",
        referee_address: "",
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from("applicants").insert([form])

        if (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } else {
            router.push("/leaderboard")
        }

        setLoading(false)
    }

    const goBack = () => {
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans px-4 py-10">
            <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold text-center mb-1">Pulse Play Global Game Enterprise</h1>
                <p className="text-center text-zinc-500 text-sm mb-8">Employment Application Form</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Employee Information */}
                    <section>
                        <h2 className="text-base font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Employee information</h2>
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Full name</label>
                                <input
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Date of birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Gender</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">State of origin</label>
                                <input
                                    name="state_of_origin"
                                    value={form.state_of_origin}
                                    onChange={handleChange}
                                    placeholder="e.g. Lagos"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Nationality</label>
                                <input
                                    name="nationality"
                                    value={form.nationality}
                                    onChange={handleChange}
                                    placeholder="e.g. Nigerian"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Marital status</label>
                                <select
                                    name="marital_status"
                                    value={form.marital_status}
                                    onChange={handleChange}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                >
                                    <option value="">Select status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Residential address</label>
                                <input
                                    name="residential_address"
                                    value={form.residential_address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Phone number</label>
                                <input
                                    name="phone_number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                    placeholder="e.g. 08012345678"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Position */}
                    <section>
                        <h2 className="text-base font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Position applied for</h2>
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Position</label>
                                <input
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Game Operator"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Department</label>
                                <input
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    placeholder="e.g. Operations"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Expected salary</label>
                                <input
                                    name="expected_salary"
                                    value={form.expected_salary}
                                    onChange={handleChange}
                                    placeholder="e.g. ₦150,000"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Background */}
                    <section>
                        <h2 className="text-base font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Background</h2>
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Educational background</label>
                                <p className="text-xs text-zinc-400">Include school attended, qualification obtained, and year</p>
                                <textarea
                                    name="education"
                                    value={form.education}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="e.g. University of Lagos — B.Sc Computer Science, 2019"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Work experience</label>
                                <p className="text-xs text-zinc-400">Include company name, position held, and duration</p>
                                <textarea
                                    name="work_experience"
                                    value={form.work_experience}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="e.g. MTN Nigeria — Sales Rep, Jan 2020 – Dec 2022"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Skills and qualifications</label>
                                <textarea
                                    name="skills_qualifications"
                                    value={form.skills_qualifications}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="List your relevant skills and certifications"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Referee */}
                    <section>
                        <h2 className="text-base font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Referee</h2>
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Referee name</label>
                                <input
                                    name="referee_name"
                                    value={form.referee_name}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Referee phone number</label>
                                <input
                                    name="referee_phone"
                                    value={form.referee_phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 08012345678"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-zinc-600 dark:text-zinc-400">Referee address</label>
                                <input
                                    name="referee_address"
                                    value={form.referee_address}
                                    onChange={handleChange}
                                    placeholder="Referee's residential address"
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit application"}
                    </button>

                    <button
                    onClick={goBack}
                    className="w-full bg-black  text-white font-semibold py-3 rounded-xl">
                        cancel
                    </button>

                </form>
            </div>
        </div>
    )
}