import Link from 'next/link';
import { Paintbrush } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container mx-auto flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                        <Paintbrush className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-xl font-bold gradient-text">PaintBidPro</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:block text-sm font-medium hover:text-white">
                        Login
                    </Link>
                    <Link href="/get-started" className="btn-primary text-sm">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
