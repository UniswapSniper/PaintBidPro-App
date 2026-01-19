"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, Zap, Shield, Star } from "lucide-react";

export default function GetStarted() {
    return (
        <div className="bg-background text-white min-h-screen">
            <div className="cosmic-bg" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <Link href="/" className="group">
                        <Image
                            src="/logo_black.png"
                            alt="PaintBidPro Logo"
                            width={200}
                            height={50}
                            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                    </Link>
                    <Link href="/" className="text-zinc-400 hover:text-white transition-colors font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-[0.9] mb-6">
                            Start Your <span className="gradient-text-blue">Free Trial</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
                            Get instant access to AI-powered painting estimates. No credit card required.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Sign Up Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="glass-card p-10 rounded-[32px]"
                        >
                            <h2 className="text-2xl font-bold mb-8">Create Your Account</h2>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="john@paintingcompany.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Awesome Painting Co."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full justify-center !py-4 !text-lg"
                                >
                                    Create Free Account
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-sm text-zinc-500">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Smartphone className="w-6 h-6 text-blue-400" />
                                    What You Get
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "LIDAR-powered room scanning",
                                        "AI-generated instant estimates",
                                        "Professional PDF proposals",
                                        "Client management dashboard",
                                        "5 free estimates per month"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-purple-400" />
                                    Why Painters Love Us
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold mb-1">10x Faster Estimates</h4>
                                            <p className="text-zinc-400 text-sm">What used to take hours now takes minutes.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold mb-1">Win More Jobs</h4>
                                            <p className="text-zinc-400 text-sm">Professional proposals that close deals faster.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-zinc-500 text-sm">
                                <p>🔒 Your data is encrypted and secure</p>
                                <p className="mt-2">
                                    By signing up, you agree to our{" "}
                                    <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
