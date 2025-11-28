'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Copy, Download, Share2, Check } from 'lucide-react';
import { Media } from '@/types/media';
import html2canvas from 'html2canvas';

interface ShareModalProps {
    media: Media;
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ media, isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [format, setFormat] = useState<'story' | 'square' | 'minimal'>('story');
    const cardRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${media.title} on Sutra!`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                // Wait for images to load
                await new Promise(resolve => setTimeout(resolve, 500));

                const canvas = await html2canvas(cardRef.current, {
                    useCORS: true,
                    backgroundColor: '#000000',
                    scale: 3,
                    logging: false,
                    allowTaint: true,
                    // Force font rendering
                    onclone: (doc) => {
                        const el = doc.getElementById('share-card-title');
                        if (el) el.style.fontFamily = 'serif'; // Fallback to ensure visibility if custom font fails
                    }
                });

                const link = document.createElement('a');
                link.download = `sutra-${media.title.toLowerCase().replace(/\s+/g, '-')}-${format}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }
    };

    const shareTo = async (platform: 'twitter' | 'whatsapp' | 'facebook' | 'instagram' | 'snapchat' | 'native') => {
        let url = '';

        // Native Share (Mobile)
        if (platform === 'native') {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Check out ${media.title}`,
                        text: shareText,
                        url: shareUrl
                    });
                } catch (e) {
                    console.warn('Native share failed', e);
                }
            }
            return;
        }

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'instagram':
            case 'snapchat':
                // For these platforms, we can't easily deep link with content without an SDK.
                // Best effort: Copy link and open app if possible, or just open generic URL.
                handleCopy();
                url = platform === 'instagram' ? 'https://instagram.com' : 'https://snapchat.com';
                break;
        }
        if (url) window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center animate-scale-in">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:-top-12 md:-right-12 z-50 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Controls */}
                <div className="w-full md:w-64 flex flex-col gap-6 order-2 md:order-1">
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Format</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['story', 'square', 'minimal'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f as any)}
                                    className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${format === f
                                        ? 'bg-white text-black border-white'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Share To</h3>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => shareTo('native')} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center" title="More Options"><Share2 className="w-5 h-5" /></button>
                            <button onClick={() => shareTo('twitter')} className="p-3 bg-black text-white border border-white/20 rounded-xl hover:bg-black/80 transition-colors flex items-center justify-center"><span className="font-bold text-lg">𝕏</span></button>
                            <button onClick={() => shareTo('whatsapp')} className="p-3 bg-[#25D366]/20 text-[#25D366] rounded-xl hover:bg-[#25D366]/30 transition-colors flex items-center justify-center"><Share2 className="w-5 h-5" /></button>
                            <button onClick={() => shareTo('instagram')} className="p-3 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={handleDownload}
                            className="w-full btn bg-white text-black hover:bg-gray-200 border-none py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Download className="w-5 h-5" />
                            Download Card
                        </button>
                    </div>
                </div>

                {/* Right: Preview (The Card) */}
                <div className="order-1 md:order-2 flex justify-center items-center bg-[#121212] p-8 rounded-3xl border border-white/5">
                    <div
                        ref={cardRef}
                        className={`relative overflow-hidden shadow-2xl bg-black border border-white/10 transition-all duration-500 ease-spring ${format === 'story' ? 'aspect-[9/16] w-[320px] rounded-[32px]' :
                                format === 'square' ? 'aspect-square w-[400px] rounded-[32px]' :
                                    'aspect-[4/3] w-[400px] rounded-xl'
                            }`}
                    >
                        {/* Background */}
                        <div className="absolute inset-0">
                            {format !== 'minimal' && (
                                <Image
                                    src={media.poster !== 'N/A' ? media.poster : '/placeholder.jpg'}
                                    alt={media.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            )}
                            {format === 'minimal' && (
                                <div className="absolute inset-0 bg-[#0a0a0a]" />
                            )}

                            {/* Overlays */}
                            <div className={`absolute inset-0 ${format === 'minimal' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-b from-black/30 via-transparent to-black/90'}`} />
                            {format !== 'minimal' && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />}
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                        <span className="text-white font-serif font-bold text-sm">S</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                    <span className="text-[10px] font-medium text-white/80 tracking-wider">
                                        IMDb {media.imdbRating}
                                    </span>
                                </div>
                            </div>

                            {/* Main Text */}
                            <div className="space-y-6 text-center">
                                {format === 'minimal' && (
                                    <div className="w-12 h-0.5 bg-white/20 mx-auto rounded-full mb-6" />
                                )}

                                <div className="space-y-2">
                                    <h2
                                        id="share-card-title"
                                        className={`font-serif text-white leading-[0.95] tracking-tight ${format === 'story' ? 'text-5xl' : 'text-6xl'
                                            }`}
                                        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                                    >
                                        {media.title}
                                    </h2>

                                    <div className="flex items-center justify-center gap-3 text-[10px] font-medium tracking-[0.2em] text-white/60 uppercase">
                                        <span>{media.year}</span>
                                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                                        <span>{media.genre?.split(',')[0]}</span>
                                    </div>
                                </div>

                                {format === 'minimal' && (
                                    <p className="text-gray-400 text-xs line-clamp-4 px-6 font-light leading-relaxed tracking-wide">
                                        {media.plot}
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-center">
                                <div className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full transition-all duration-300 cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                        <MonitorPlay className="w-3 h-3 text-black fill-current" />
                                    </div>
                                    <span className="text-xs font-medium text-white tracking-wide">Watch on Sutra</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MonitorPlay(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m10 7 5 3-5 3Z" />
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <path d="M12 17v4" />
            <path d="M8 21h8" />
        </svg>
    )
}
