'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Eye } from 'lucide-react';
import { Media } from '@/types/media';
import { cn } from '@/lib/utils';
import { libraryService } from '@/lib/services/library.service';

interface MediaCardProps {
    media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
    const posterUrl = media.poster !== 'N/A' ? media.poster : '/placeholder.jpg';
    const [isWatched, setIsWatched] = useState(false);

    useEffect(() => {
        setIsWatched(libraryService.isWatched(media.imdbID));
    }, [media.imdbID]);

    const handleToggleWatched = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newState = libraryService.toggleWatched(media);
        setIsWatched(newState);
    };

    return (
        <div className="group relative">
            <Link href={`/media?id=${media.imdbID}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900 border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-black/50">
                    <Image
                        src={posterUrl}
                        alt={media.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-1 text-[var(--color-accent-gold)] font-bold">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{media.imdbRating}</span>
                            </div>
                            <span className="text-white text-xs font-medium px-2 py-1 bg-white/10 rounded-full border border-white/10">
                                {media.type === 'series' && media.totalSeasons
                                    ? `${media.totalSeasons} Season${parseInt(media.totalSeasons) > 1 ? 's' : ''}`
                                    : media.year}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                            <button className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors" title="Add to Watchlist">
                                <Plus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleToggleWatched}
                                className={cn(
                                    "p-2 rounded-full transition-colors border",
                                    isWatched
                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-[var(--color-primary)]/80"
                                        : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                                )}
                                title={isWatched ? "Mark as Unwatched" : "Mark as Watched"}
                            >
                                <Eye className={cn("w-5 h-5", isWatched && "fill-current")} />
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
