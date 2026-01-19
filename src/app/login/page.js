"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="bg-background text-white min-h-screen flex items-center justify-center">
            <div className="cosmic-bg" />

            {/* Main Content */}
            <div className="w-full max-w-md px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Logo */}
                    <Link href="/" className="block mb-12 group">
                        <Image
                            src="/logo_black.png"
                            alt="PaintBidPro Logo"
                            width={300}
                            height={75}
                            className="h-16 w-auto object-contain mx-auto transition-transform group-hover:scale-105"
                            priority
                        />
                    </Link>

                    {/* Login Card */}
                    <div className="glass-card p-10 rounded-[32px]">
                        <h1 className="text-3xl font-black tracking-tight mb-2 text-center">Welcome Back</h1>
                        <p className="text-zinc-400 text-center mb-8">Sign in to your account</p>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5" />
                                    <span className="text-zinc-400">Remember me</span>
                                </label>
                                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full justify-center !py-4 !text-lg"
                            >
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/10 text-center">
                            <p className="text-zinc-400">
                                Don't have an account?{" "}
                                <Link href="/get-started" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    Start Free Trial
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
