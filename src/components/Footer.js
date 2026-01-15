import Link from 'next/link';
import { Paintbrush, Twitter, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-500/5 via-purple-500/5 to-transparent blur-3xl" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Paintbrush className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Paint<span className="gradient-text">Bid</span>Pro
                            </span>
                        </Link>
                        <p className="text-zinc-500 mb-6 max-w-sm leading-relaxed">
                            Revolutionizing the painting industry with AI-powered estimates and LIDAR scanning technology.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                                <Twitter className="w-4 h-4 text-zinc-400" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                                <Linkedin className="w-4 h-4 text-zinc-400" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                                <Instagram className="w-4 h-4 text-zinc-400" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                                <Mail className="w-4 h-4 text-zinc-400" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white">Product</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#features" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                                    Features
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                                    Mobile App
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                                    Pricing
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                                    Changelog
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white">Legal</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-600">
                        © {new Date().getFullYear()} PaintBidPro. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-zinc-600">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
