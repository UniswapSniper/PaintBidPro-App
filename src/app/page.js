import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Download, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      <main className={styles.hero}>
        <div className="container mx-auto px-6">
          <div className={styles.heroContent}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-6 text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Now available on iOS & Android
              </div>

              <h1 className={styles.title}>
                Painting Bids <br />
                <span className="gradient-text">Reimagined.</span>
              </h1>

              <p className={styles.subtitle}>
                Stop measuring walls by hand. PaintBidPro uses LIDAR and AI to verify dimensions and generate professional quotes in seconds.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/get-started" className="btn-primary flex items-center gap-2">
                  Get a Free Bid <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/download" className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-semibold">
                  <Download className="w-5 h-5" /> Download App
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>AI Accurate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cloud Sync</span>
                </div>
              </div>
            </div>

            <div className={styles.visual}>
              <div className={styles.blob}></div>
              <div className={styles.card}>
                <div className="border border-white/10 bg-black/40 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Living Room</span>
                    <span className="text-green-400 text-sm font-mono">+ LIDAR VERIFIED</span>
                  </div>
                  <div className="h-32 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://placehold.co/400x200/png?text=LIDAR+Scan')] opacity-20 bg-cover"></div>
                    <span className="z-10 text-indigo-300 font-mono text-xs">Scanning... 98%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Wall Area</span>
                    <span className="font-mono">452 sq ft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trim</span>
                    <span className="font-mono">124 linear ft</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimate</span>
                    <span className="gradient-text">$1,250.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
