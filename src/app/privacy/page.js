import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Privacy Policy | PaintBidPro",
    description: "Learn how PaintBidPro protects your privacy and handles your data."
};

export default function Privacy() {
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
                        Privacy <span className="gradient-text-blue">Policy</span>
                    </h1>
                    <p className="text-zinc-400 mb-12">Last updated: January 19, 2026</p>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8">
                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account,
                                use our services, or contact us for support. This includes your name, email address,
                                company information, and payment details when applicable.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We use the information we collect to provide, maintain, and improve our services,
                                process transactions, send you technical notices and support messages, and respond
                                to your comments and questions.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">3. LIDAR Data</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                When you use our LIDAR scanning feature, room dimension data is processed locally
                                on your device. Only the final measurements and estimates are stored on our servers
                                to generate your proposals. We do not store raw LIDAR point cloud data.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We implement industry-standard security measures to protect your personal information.
                                All data is encrypted in transit and at rest. We regularly audit our systems and
                                update our security practices.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                You have the right to access, correct, or delete your personal information at any time.
                                You can also export your data or request that we stop processing it. Contact us at
                                privacy@paintbidpro.com to exercise these rights.
                            </p>
                        </section>

                        <section className="glass-card p-8 rounded-[24px]">
                            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-blue-400 mt-4">privacy@paintbidpro.com</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
