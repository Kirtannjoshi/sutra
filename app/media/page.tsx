'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { omdbService } from '@/lib/services/omdb.service';
import { sutraService } from '@/lib/services/sutra.service';
import SutraFeed from '@/components/media/SutraFeed';
import SeasonViewer from '@/components/media/SeasonViewer';
import WhereToWatch from '@/components/media/WhereToWatch';
import ReviewSystem from '@/components/media/ReviewSystem';
import AddToListModal from '@/components/media/AddToListModal';
import ShareModal from '@/components/media/ShareModal';
import TrailerModal from '@/components/media/TrailerModal';
import ExternalLinks from '@/components/media/ExternalLinks';
import { Star, Calendar, Clock, ArrowLeft, Play, Plus, Share2, User, Eye } from 'lucide-react';
import { Media } from '@/types/media';
import { libraryService } from '@/lib/services/library.service';
import MediaTitle from '@/components/media/MediaTitle';

function ReadMore({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggle = () => setIsExpanded(!isExpanded);

    // If text is short, just show it
    if (text.length < 150) return <p className="text-lg text-gray-300 leading-relaxed font-light">{text}</p>;

    return (
        <div className="relative group cursor-pointer" onClick={toggle}>
            <p className={`text-lg text-gray-300 leading-relaxed font-light transition-all duration-500 ${isExpanded ? '' : 'line-clamp-3'}`}>
                {text}
            </p>
            {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent flex items-end justify-center pb-2">
                    <span className="text-xs font-bold text-[var(--color-accent-gold)] uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                        Read More
                    </span>
                </div>
            )}
        </div>
    );
}

function MediaPageContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [media, setMedia] = useState<Media | null>(null);
    const [trailerId, setTrailerId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMedia = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const data = await omdbService.getMediaDetails(id);
                setMedia(data);
                if (data) {
                    const tid = sutraService.getTrailerId(data.title);
                    setTrailerId(tid);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
                setMedia(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!media) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white space-y-4">
                <h1 className="text-2xl font-bold">Media Not Found</h1>
                <Link href="/" className="text-[var(--color-primary)] hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    const backdropUrl = media.poster !== 'N/A' ? media.poster : '/placeholder.jpg';

    return (
        <main className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Minimalist Hero Section */}
            <div className="relative w-full h-[70vh] lg:h-[80vh] overflow-hidden group">
                <div className="absolute inset-0">
                    <Image
                        src={backdropUrl}
                        alt={media.title}
                        fill
                        className="object-cover opacity-40 animate-ken-burns"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                </div>

                <div className="absolute top-6 left-6 z-20">
                    <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 z-10">
                    <div className="max-w-5xl space-y-6">
                        {/* Adaptive Title */}
                        <MediaTitle
                            title={media.title}
                            genre={media.genre}
                            className="text-6xl md:text-8xl lg:text-9xl"
                            style={{ animationDelay: '0.1s' }}
                        />

                        {/* Minimal Meta (Below Title) */}
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-300 tracking-wide animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            <span>{media.year}</span>
                            <span className="text-gray-500">•</span>
                            <span className="border border-gray-500 px-1 rounded text-xs">{media.rated}</span>
                            <span className="text-gray-500">•</span>
                            <span>{media.type === 'series' ? media.totalSeasons + ' Seasons' : media.runtime}</span>
                            <span className="text-gray-500">•</span>
                            <span>{(media.language || '').split(',').length} Languages</span>
                            {media.imdbRating && (
                                <>
                                    <span className="text-gray-500">•</span>
                                    <div className="flex items-center gap-1 text-[var(--color-accent-gold)]">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{media.imdbRating}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Minimal Plot */}
                        <div className="max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <ReadMore text={media.plot || 'No plot summary available.'} />
                        </div>

                        {/* Genres (Pipes) */}
                        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-200 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                            {(media.genre || '').split(', ').map((g, i) => (
                                <span key={g} className="flex items-center gap-2">
                                    {i > 0 && <span className="text-gray-600 font-light">|</span>}
                                    <span>{g}</span>
                                </span>
                            ))}
                        </div>

                        {/* Languages (Chips) */}
                        <div className="flex flex-wrap items-center gap-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            {(media.language || '').split(', ').slice(0, 5).map((lang) => (
                                <span key={lang} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300 backdrop-blur-sm">
                                    {lang}
                                </span>
                            ))}
                            {(media.language || '').split(', ').length > 5 && (
                                <span className="text-xs text-gray-500">+ more</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.35s' }}>
                            <button
                                onClick={() => setIsTrailerModalOpen(true)}
                                className="btn bg-white text-black hover:bg-gray-200 border-none px-8 py-4 rounded-full flex items-center gap-3 font-bold text-lg transition-transform hover:scale-105"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Trailer
                            </button>
                            <button
                                onClick={() => setIsListModalOpen(true)}
                                className="btn bg-white/10 hover:bg-white/20 text-white border border-white/10 p-4 rounded-full backdrop-blur-md transition-all hover:scale-105"
                                title="Add to List"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => {
                                    if (libraryService.isWatched(media.imdbID)) {
                                        libraryService.removeFromWatched(media.imdbID);
                                    } else {
                                        libraryService.markAsWatched(media);
                                    }
                                    // Force re-render to update UI state (simple way for now)
                                    setMedia({ ...media });
                                }}
                                className={`btn p-4 rounded-full backdrop-blur-md transition-all hover:scale-105 border ${libraryService.isWatched(media.imdbID)
                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-[var(--color-primary)]/80'
                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                                    }`}
                                title={libraryService.isWatched(media.imdbID) ? "Remove from Diary" : "Mark as Watched"}
                            >
                                <Eye className={`w-6 h-6 ${libraryService.isWatched(media.imdbID) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="btn bg-white/10 hover:bg-white/20 text-white border border-white/10 p-4 rounded-full backdrop-blur-md transition-all hover:scale-105"
                                title="Share"
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 -mt-10 relative z-20 space-y-24">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-20">
                        {/* Season Viewer (if series) */}
                        {media.type === 'series' && (
                            <section>
                                <h2 className="text-3xl font-light text-white mb-10 tracking-tight">Episodes</h2>
                                <SeasonViewer imdbId={media.imdbID} totalSeasons={media.totalSeasons || '1'} />
                            </section>
                        )}

                        {/* Cast & Crew Section */}
                        <section>
                            <h2 className="text-3xl font-light text-white mb-10 tracking-tight">Cast & Crew</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Cast */}
                                <div className="space-y-8">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Starring</h3>
                                    <div className="space-y-6">
                                        {media.actors?.split(', ').map((actor, i) => (
                                            <div key={i} className="flex items-center gap-6 group cursor-default">
                                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <span className="text-xl text-gray-300 font-light group-hover:text-white transition-colors">{actor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Crew */}
                                <div className="space-y-10">
                                    {media.director && media.director !== 'N/A' && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Director</h3>
                                            <div className="text-xl text-white font-light">{media.director}</div>
                                        </div>
                                    )}

                                    {media.writer && media.writer !== 'N/A' && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Writers</h3>
                                            <div className="text-lg text-gray-400 font-light leading-relaxed">{media.writer}</div>
                                        </div>
                                    )}

                                    {media.awards && media.awards !== 'N/A' && (
                                        <div className="pt-8 border-t border-white/5 space-y-3">
                                            <h3 className="text-xs font-bold text-[var(--color-accent-gold)] uppercase tracking-[0.2em]">Awards</h3>
                                            <div className="text-lg text-white/80 italic font-light">{media.awards}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Sutra Feed */}
                        <section>
                            <h2 className="text-3xl font-light text-white mb-10 tracking-tight">Community Feed</h2>
                            <SutraFeed media={media} />
                        </section>
                    </div>

                    {/* Right Column: Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="sticky top-24 space-y-12">
                            {/* Ratings - Minimal */}
                            <div className="flex items-center gap-4">
                                <Star className="w-8 h-8 text-[var(--color-accent-gold)] fill-current" />
                                <div>
                                    <div className="text-4xl font-light text-white">{media.imdbRating}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">IMDb Rating</div>
                                </div>
                            </div>

                            {/* Genres - Minimal Tags */}
                            <div className="flex flex-wrap gap-3">
                                {media.genre?.split(', ').map((g) => (
                                    <span key={g} className="px-4 py-2 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-default">
                                        {g}
                                    </span>
                                ))}
                            </div>

                            <WhereToWatch
                                imdbId={media.imdbID}
                                title={media.title}
                                year={media.year}
                            />

                            <ExternalLinks
                                title={media.title}
                                imdbId={media.imdbID}
                                type={media.type as 'movie' | 'series' | 'anime'}
                            />

                            <ReviewSystem id={media.imdbID} title="Rate this Title" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddToListModal
                media={media}
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
            />
            <ShareModal
                media={media}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
            <TrailerModal
                title={media.title}
                videoId={trailerId}
                isOpen={isTrailerModalOpen}
                onClose={() => setIsTrailerModalOpen(false)}
            />
        </main>
    );
}

export default function MediaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        }>
            <MediaPageContent />
        </Suspense>
    );
}
