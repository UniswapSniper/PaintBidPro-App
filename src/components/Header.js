import Link from 'next/link';
import { Paintbrush, Menu, X } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="glass rounded-2xl">
                    <div className="container mx-auto flex items-center justify-between h-16 px-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                                <Paintbrush className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Paint<span className="gradient-text">Bid</span>Pro
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                How it Works
                            </Link>
                            <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <Link href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                Testimonials
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="hidden md:flex text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/get-started"
                                className="btn-primary text-sm py-2.5 px-5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
