
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();

            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (loginError) {
                setError("Invalid email or password.");
                return;
            }

            router.replace("/auth/redirect");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f3efe7] px-5 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold tracking-wide text-[#3f3528]">
                        PURANA AYURVEDA
                    </h1>
                    <p className="mt-2 text-sm tracking-[0.2em] text-[#8b7b68]">
                        MANAGEMENT PORTAL
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#e7dfd3] p-8">
                    <h2 className="text-2xl font-semibold text-[#3f3528]">
                        Welcome back
                    </h2>

                    <p className="text-sm text-[#8b8175] mt-2 mb-7">
                        Sign in to access your account.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-[#3f3528] mb-2"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-[#ded5c9] px-4 py-3 text-sm outline-none focus:border-[#8b765d] focus:ring-2 focus:ring-[#cbb89d]/30"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#3f3528] mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-[#ded5c9] px-4 py-3 pr-20 text-sm outline-none focus:border-[#8b765d] focus:ring-2 focus:ring-[#cbb89d]/30"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8b765d]"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="text-sm text-red-600 bg-red-50 rounded-lg p-3"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-[#3f3528] text-white py-3 text-sm font-medium hover:bg-[#514434] disabled:opacity-60 transition-colors"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[#a1978b]">
                            Authorized personnel only
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-[#a1978b] mt-6">
                    © {new Date().getFullYear()} Purana Ayurveda
                </p>
            </div>
        </main>
    );
}
