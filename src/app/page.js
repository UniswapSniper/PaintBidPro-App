"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Paintbrush,
  Shield,
  Zap,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Sparkles,
  Layout,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Components ---

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-4 px-6 md:px-12" : "py-8 px-6 md:px-12"}`}>
      <div className={`mx-auto max-w-7xl transition-all duration-500 ${isScrolled ? "glass rounded-full px-6 py-2 shadow-2xl shadow-black/40" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center group opacity-0 pointer-events-none">
            {/* Logo removed from here to be placed in Hero */}
            <div className="h-14 md:h-20 w-[240px]" />
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Features", "Pricing", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/get-started" className="btn-primary py-2.5 px-6 !text-sm">
              Start Free
            </Link>
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 glass p-8 rounded-3xl md:hidden flex flex-col gap-6"
          >
            {["Features", "Pricing", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <hr className="border-white/10" />
            <Link href="/login" className="text-lg font-bold">Sign In</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="glass-card p-10 rounded-[32px] relative overflow-hidden group"
    >
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-[20px] bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} width={80} height={80} className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Icon className="w-10 h-10 text-white" />
          )}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-lg">
          {desc}
        </p>
      </div>
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="bg-background text-white selection:bg-white/20">
      <div className="cosmic-bg" />
      <Nav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="grid-overlay" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">

            {/* Left Column */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Link href="/" className="inline-block mb-12 group">
                  <Image
                    src="/logo_black.png"
                    alt="PaintBidPro Logo"
                    width={985}
                    height={233}
                    className="w-[600px] md:w-[800px] lg:w-[960px] h-auto object-contain transition-all duration-500 group-hover:scale-105"
                    priority
                  />
                </Link>

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">v2.0 is Live & Faster</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-8">
                  The Future of <br />
                  <span className="gradient-text-blue">Painting Bids</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed font-medium max-w-xl">
                  AI-powered LIDAR scanning that generates museum-grade accuracy for every quote. Instant measurements, zero hardware.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/get-started" className="btn-primary group w-full sm:w-auto">
                    Transform My Business
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="#demo" className="btn-secondary group w-full sm:w-auto">
                    <Play className="w-5 h-5 fill-white" />
                    Watch Interactive Demo
                  </Link>
                </div>

                <div className="mt-16 flex items-center gap-8">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#030303] bg-zinc-800 overflow-hidden relative">
                        <Image
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest"><span className="text-white">4.9/5</span> from 5,000+ Pros</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Visual */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute -inset-20 blur-bg-blue opacity-30 animate-pulse-glow" />
                <div className="absolute -inset-20 blur-bg-purple opacity-20 -z-10" />

                <div className="relative animate-float">
                  <div className="glass-card p-4 rounded-[40px] shadow-2xl overflow-hidden border-white/20">
                    <Image
                      src="/hero.png"
                      alt="Product Preview"
                      width={1000}
                      height={1200}
                      className="rounded-[32px] w-full object-cover"
                      priority
                    />
                  </div>

                  {/* Floating Notification */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -right-8 bottom-12 glass p-6 rounded-3xl shadow-2xl border-white/10 hidden md:block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">$12,450.00</div>
                        <div className="text-xs text-zinc-500">Estimate Generated</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Speed Badge */}
                  <div className="absolute -left-12 top-24 glass-light px-6 py-4 rounded-3xl shadow-xl hidden md:block rotate-[-5deg]">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <div className="text-lg font-black tracking-tighter">10X FASTER</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-24 border-y border-white/5 relative bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: "2M+", label: "Estimates Generated" },
              { val: "10k+", label: "Pro Painters" },
              { val: "99.9%", label: "Accuracy Rate" },
              { val: "24/7", label: "Smart Support" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{stat.val}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tightest leading-none">
                Built for <span className="gradient-text-gold">Champions</span>.
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 font-medium">
                The most advanced toolset ever created for the painting industry. Period.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              imageUrl="/lidar.png"
              title="Hyper-Precise LIDAR"
              desc="Our scanning engine uses millisecond-pulsed light to capture dimensions with surgical precision."
              delay={0.1}
            />
            <FeatureCard
              imageUrl="/ai.png"
              title="Generative Estimates"
              desc="Proprietary AI analyzes wall textures and job complexity to give you the perfect price every time."
              delay={0.2}
            />
            <FeatureCard
              imageUrl="/success.png"
              title="Conversion Engine"
              desc="Professional, high-impact PDF proposals that look like they were designed by an agency."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tightest leading-none">
                Simple <span className="gradient-text-blue">Pricing</span>
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 font-medium">
                Start free. Upgrade when you're ready to dominate.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "Free", desc: "Perfect for trying out PaintBidPro", features: ["5 estimates/month", "Basic LIDAR scanning", "PDF exports", "Email support"] },
              { name: "Pro", price: "$49", desc: "For growing painting businesses", features: ["Unlimited estimates", "Advanced AI pricing", "Client portal", "Priority support", "Team collaboration"], popular: true },
              { name: "Enterprise", price: "Custom", desc: "For large painting companies", features: ["Everything in Pro", "Custom integrations", "Dedicated success manager", "SLA guarantee", "White-label options"] }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`glass-card p-8 rounded-[32px] relative ${plan.popular ? 'border-2 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-black mb-2">{plan.price}<span className="text-lg text-zinc-500 font-medium">{plan.price !== "Custom" && plan.price !== "Free" ? "/mo" : ""}</span></div>
                <p className="text-zinc-500 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-zinc-400">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/get-started" className={`block text-center py-3 px-6 rounded-full font-bold transition-all ${plan.popular ? 'btn-primary' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 -z-10" />
        <div className="container mx-auto px-6">
          <div className="glass-card p-16 md:p-32 rounded-[64px] relative overflow-hidden text-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tightest leading-none">
                Ready to stop <br />
                <span className="text-zinc-600 group-hover:text-white transition-colors duration-500">measuring by hand?</span>
              </h2>
              <p className="text-xl md:text-3xl text-zinc-400 mb-16 leading-relaxed max-w-2xl mx-auto">
                Join 10,000+ pros who save 40+ hours every month.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/get-started" className="btn-primary !py-5 !px-12 !text-xl shadow-[0_20px_60px_rgba(255,255,255,0.15)]">
                  Join the Elite
                </Link>
                <Link href="#pricing" className="text-xl font-black tracking-tight flex items-center gap-3 hover:translate-x-2 transition-transform">
                  View Pricing <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-8 group">
                <Image
                  src="/logo_black.png"
                  alt="PaintBidPro Logo"
                  width={280}
                  height={70}
                  className="h-16 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <p className="text-zinc-500 text-lg leading-relaxed mb-8">
                Revolutionizing the bidding process for painting professionals worldwide. Built with love in California.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                    <Star className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product", links: [
                  { label: "Features", href: "#features" },
                  { label: "Mobile App", href: "/get-started" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Enterprise", href: "#pricing" }
                ]
              },
              {
                title: "Company", links: [
                  { label: "About", href: "#about" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "#demo" }
                ]
              },
              {
                title: "Legal", links: [
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                  { label: "Cookie Policy", href: "#" },
                  { label: "Security", href: "#" }
                ]
              }
            ].map((cat, i) => (
              <div key={i}>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">{cat.title}</h4>
                <ul className="space-y-4">
                  {cat.links.map(link => (
                    <li key={link.label}><Link href={link.href} className="text-zinc-500 hover:text-white transition-colors text-lg">{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-600">© 2026 PaintBidPro.com — All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
