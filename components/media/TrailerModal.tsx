'use client';

import { X, ExternalLink } from 'lucide-react';

interface TrailerModalProps {
    title: string;
    videoId?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function TrailerModal({ title, videoId, isOpen, onClose }: TrailerModalProps) {
    if (!isOpen) return null;

    const src = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + ' official trailer')}&autoplay=1`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <iframe
                    src={src}
                    title={`${title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />

                {!videoId && (
                    <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-lg font-medium text-sm shadow-lg transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Watch on YouTube
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
