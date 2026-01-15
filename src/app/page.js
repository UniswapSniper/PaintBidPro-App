"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowRight, Download, CheckCircle, Sparkles, Zap, Shield, Smartphone, Play, Star, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <main className="min-h-screen relative overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-50" />

        <section className="pt-32 pb-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left Content */}
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="badge mb-8">
                  <span className="pulse-dot" />
                  <span>Now with AI-Powered Estimates</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight">
                  Painting Bids
                  <br />
                  <span className="gradient-text">Made Effortless.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
                  Stop measuring walls by hand. PaintBidPro uses <span className="text-white font-medium">LIDAR technology</span> and <span className="text-white font-medium">AI intelligence</span> to generate accurate, professional quotes in seconds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 items-center mb-12">
                  <Link href="/get-started" className="btn-primary group">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/demo" className="btn-secondary group">
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Right Visual - App Preview */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-20 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/10 blur-3xl rounded-full" />

                <div className="relative float">
                  {/* Main Card */}
                  <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">Living Room</div>
                          <div className="text-xs text-zinc-500">LIDAR Scanned</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                        ✓ Verified
                      </div>
                    </div>

                    {/* Scan Preview */}
                    <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(59,130,246,0.1)_50%,transparent_55%)] bg-[length:200%_200%] animate-[shimmer_2s_infinite]" />
                      <div className="text-center z-10">
                        <div className="text-3xl font-bold text-white mb-1">452</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Sq. Feet</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Wall Area</span>
                        <span className="font-mono font-medium">452 sq ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Trim & Baseboards</span>
                        <span className="font-mono font-medium">124 linear ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Windows & Doors</span>
                        <span className="font-mono font-medium">6 units</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Estimated Quote</span>
                      <span className="text-2xl font-bold gradient-text">$1,250</span>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -right-4 top-20 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500">Save Time</div>
                        <div className="text-sm font-semibold">10x Faster</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Rating */}
                  <div className="absolute -left-8 bottom-20 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">4.9</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">2,847 reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative z-10" id="features">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Painters <span className="gradient-text-blue">Love Us</span>
              </h2>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                Everything you need to streamline your painting business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">LIDAR Scanning</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Use your iPhone or iPad's LIDAR sensor to capture precise room measurements in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Estimates</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Our AI analyzes your scan and generates accurate, professional quotes tailored to your pricing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Win More Jobs</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Impress clients with instant, professional-looking proposals that close deals faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="card p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-orange-500/5" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to transform your business?
                </h2>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                  Join thousands of painting professionals who save hours every week with PaintBidPro.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/get-started" className="btn-primary">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/demo" className="btn-secondary">
                    Schedule a Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Shimmer Animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
