'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Star, PlayCircle, Clock } from 'lucide-react';
import { omdbService } from '@/lib/services/omdb.service';
import { Episode } from '@/types/media';
import { cn } from '@/lib/utils';
import ReviewSystem from './ReviewSystem';

interface SeasonViewerProps {
    imdbId: string;
    totalSeasons: string;
}

export default function SeasonViewer({ imdbId, totalSeasons }: SeasonViewerProps) {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSeasonOpen, setIsSeasonOpen] = useState(false);

    const seasonsCount = parseInt(totalSeasons) || 1;
    const seasons = Array.from({ length: seasonsCount }, (_, i) => i + 1);

    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            try {
                const data = await omdbService.getSeasonEpisodes(imdbId, selectedSeason);
                setEpisodes(data?.episodes || []);
            } catch (error) {
                console.error('Error fetching episodes:', error);
                setEpisodes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [imdbId, selectedSeason]);

    // Check for upcoming episodes
    const upcomingEpisode = episodes.find(ep => {
        if (!ep.released || ep.released === 'N/A') return false;
        const date = new Date(ep.released);
        return !isNaN(date.getTime()) && date > new Date();
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Episodes</h2>

                {/* Season Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsSeasonOpen(!isSeasonOpen)}
                        className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 min-w-[160px] justify-between group"
                    >
                        <span className="font-medium text-white tracking-wide text-sm">SEASON {selectedSeason}</span>
                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-white", isSeasonOpen && "rotate-180")} />
                    </button>

                    {isSeasonOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 max-h-60 overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-20 custom-scrollbar backdrop-blur-xl">
                            {seasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() => {
                                        setSelectedSeason(season);
                                        setIsSeasonOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-5 py-3 text-sm transition-colors border-l-2",
                                        selectedSeason === season
                                            ? "border-[var(--color-primary)] bg-white/5 text-white font-medium"
                                            : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    Season {season}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Alert */}
            {upcomingEpisode && (
                <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 flex items-start gap-4 animate-fade-in group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="p-3 bg-blue-500/20 rounded-full shrink-0 relative z-10">
                        <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Next Episode</h4>
                        <p className="text-white font-bold text-lg leading-tight">
                            {upcomingEpisode.title}
                        </p>
                        <p className="text-gray-400 text-sm mt-1 font-mono">
                            Episode {upcomingEpisode.episode} • {upcomingEpisode.released}
                        </p>
                    </div>
                </div>
            )}

            {/* Episode List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/20"></div>
                    </div>
                ) : (
                    episodes.map((episode) => {
                        const isReleased = episode.released !== 'N/A' && new Date(episode.released) <= new Date();

                        return (
                            <div
                                key={episode.imdbID}
                                className="group flex items-center gap-6 p-5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                            >
                                {/* Number */}
                                <span className="text-xl font-bold text-white/20 group-hover:text-white/40 transition-colors w-8 text-center font-mono">
                                    {(episode.episode || '0').padStart(2, '0')}
                                </span>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-lg truncate group-hover:text-white transition-colors tracking-tight">
                                        {episode.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5 font-mono uppercase tracking-wide">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            {episode.released}
                                        </span>
                                        {isReleased && episode.imdbRating && episode.imdbRating !== 'N/A' && (
                                            <span className="flex items-center gap-1.5 text-[var(--color-accent-gold)]">
                                                <Star className="w-3 h-3 fill-current" />
                                                {episode.imdbRating}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                    {isReleased ? (
                                        <button className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            <PlayCircle className="w-5 h-5 fill-current" />
                                        </button>
                                    ) : (
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wider">
                                            Upcoming
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Season Rating */}
            <div className="mt-12 pt-12 border-t border-white/5">
                <ReviewSystem
                    id={`${imdbId}-season-${selectedSeason}`}
                    title={`Rate Season ${selectedSeason}`}
                    className="bg-white/5 border-white/10"
                />
            </div>
        </div>
    );
}
