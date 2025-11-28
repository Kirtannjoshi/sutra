'use client';

import { ArrowLeft, Globe, Search, Database, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            รµƭ૨α
                        </h1>
                        <div className="inline-block px-3 py-1 bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/50 rounded-full text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                            Digital α
                        </div>
                    </div>

                    {/* Motto Section */}
                    <div className="bg-surface border border-white/5 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                            "The ultimate browser for your movie universe."
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Our motto is simple: To build a site where you can find exactly what you're looking for.
                            Think of Sutra not just as a library, but as a specialized browser designed specifically for your cinematic journey.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Search className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Precision Search</h3>
                            <p className="text-sm text-gray-400">Find movies, shows, and anime with pinpoint accuracy using our advanced OMDb integration.</p>
                        </div>

                        <div className="bg-surface border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Database className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Personal Library</h3>
                            <p className="text-sm text-gray-400">Track what you've watched, rate it with our custom "Absolute Cinema" scale, and build your collection.</p>
                        </div>

                        <div className="bg-surface border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Globe className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Universal Access</h3>
                            <p className="text-sm text-gray-400">A seamless experience across all your devices, designed to be the only movie tool you'll ever need.</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-12 border-t border-white/5">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Sutra Project. Built for the love of cinema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
