'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Plus, Info } from 'lucide-react';
import { Media } from '@/types/media';
import Link from 'next/link';

interface HeroSectionProps {
    featuredMedia: Media[];
}

export default function HeroSection({ featuredMedia }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (featuredMedia.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMedia.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [featuredMedia.length]);

    if (!featuredMedia.length) return null;

    const currentMedia = featuredMedia[currentIndex];
    const backdropUrl = currentMedia.poster !== 'N/A' ? currentMedia.poster : '/placeholder.jpg';

    return (
        <section className="relative w-full h-[75vh] overflow-hidden rounded-3xl mx-auto max-w-[1920px] shadow-2xl border border-white/5 group">
            {/* Background Image with Parallax-like effect */}
            <div className="absolute inset-0">
                <Image
                    src={backdropUrl}
                    alt={currentMedia.title}
                    fill
                    className="object-cover transition-all duration-[2000ms] ease-in-out transform scale-105 group-hover:scale-110"
                    priority
                />
                {/* Gradient Overlay - More Subtle */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 w-full md:w-2/3 lg:w-1/2 flex flex-col gap-6 z-10">
                <div className="space-y-3 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/10">
                            Featured Premiere
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight text-balance drop-shadow-xl">
                        {currentMedia.title}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-300 text-xs font-bold tracking-widest uppercase pt-2">
                        <span>{currentMedia.year}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        <span>{currentMedia.type === 'series' ? 'TV Series' : 'Movie'}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        <span className="flex items-center gap-1 text-[var(--color-accent-gold)]">
                            ★ {currentMedia.imdbRating}
                        </span>
                    </div>
                </div>

                <p className="text-gray-300 text-sm md:text-base line-clamp-2 leading-relaxed max-w-xl animate-slide-up font-light opacity-90" style={{ animationDelay: '0.1s' }}>
                    {currentMedia.plot}
                </p>

                <div className="flex items-center gap-3 animate-slide-up pt-2" style={{ animationDelay: '0.2s' }}>
                    <Link
                        href={`/media?id=${currentMedia.imdbID}`}
                        className="btn bg-white text-black hover:bg-gray-200 border-none px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Watch Now
                    </Link>
                    <button className="btn bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-3 rounded-full flex items-center gap-2 font-bold text-sm backdrop-blur-md transition-all hover:scale-105">
                        <Plus className="w-4 h-4" />
                        My List
                    </button>
                    <Link
                        href={`/media?id=${currentMedia.imdbID}`}
                        className="btn bg-white/5 hover:bg-white/10 text-white border border-white/5 px-4 py-3 rounded-full backdrop-blur-md transition-all hover:scale-105"
                    >
                        <Info className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                {featuredMedia.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
