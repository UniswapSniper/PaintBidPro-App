import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Terms of Service | PaintBidPro",
    description: "Read the terms and conditions for using PaintBidPro services."
};

export default function Terms() {
    return (
        <div className="bg-background text-white min-h-screen">
            <div className="cosmic-bg" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 glass">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <Link href="/" className="group">
                        <Image
                            src="/logo_black.png"
                            alt="PaintBidPro Logo"
                            width={200}
                            height={50}
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tightest mb-8">
                        Terms of <span className="gradient-text-gold">Service</span>
                    </h1>
                    <p className="text-zinc-400 mb-12">Last updated: January 19, 2026</p>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8">
                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                By accessing or using PaintBidPro, you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                PaintBidPro provides AI-powered painting estimate software including LIDAR room scanning,
                                automated pricing calculations, proposal generation, and client management tools.
                                Features may vary based on your subscription plan.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials
                                and for all activities that occur under your account. You must notify us immediately
                                of any unauthorized use of your account.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">4. Subscription & Billing</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel
                                your subscription at any time, but no refunds will be provided for partial billing periods.
                                We reserve the right to change our pricing with 30 days notice.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Estimates</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                While our AI-powered estimates are designed to be highly accurate, they are provided
                                as tools to assist your business decisions. PaintBidPro is not liable for any financial
                                losses resulting from estimate inaccuracies. Users should always verify measurements
                                and pricing before finalizing client proposals.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                All content, features, and functionality of PaintBidPro are owned by us and are
                                protected by copyright, trademark, and other intellectual property laws. You may not
                                copy, modify, or distribute our software without express written permission.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                PaintBidPro shall not be liable for any indirect, incidental, special, consequential,
                                or punitive damages resulting from your use of or inability to use the service.
                                Our total liability shall not exceed the amount you paid us in the 12 months prior
                                to the claim.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                For questions about these Terms of Service, please contact us at:
                            </p>
                            <p className="text-blue-400 mt-4">legal@paintbidpro.com</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
