'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Globe, ExternalLink, MessageCircle, Twitter, Instagram, Newspaper, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sutraService } from '@/lib/services/sutra.service';
import { Media } from '@/types/media';

interface SutraFeedProps {
    media: Media;
}

interface FeedItem {
    id: string;
    type: 'video' | 'announcement' | 'article' | 'discussion' | 'image' | 'meme' | 'short';
    title: string;
    content?: string;
    thumbnail?: string;
    source: string;
    timestamp: string;
    views?: string;
    url: string;
    isAnalysis?: boolean;
    author?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    videoId?: string;
    domain?: string;
    snippet?: string;
    tags?: string[];
    authorAvatar?: string;
    authorHandle?: string;
    verified?: boolean;
    image?: string;
}

export default function SutraFeed({ media }: SutraFeedProps) {
    const [filter, setFilter] = useState<'all' | 'videos' | 'announcements' | 'analysis'>('all');
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                // @ts-ignore - Service returns compatible types but strict check might fail on exact match
                const items = await sutraService.fetchFeed(media, 'all');
                setFeedItems(items as unknown as FeedItem[]);
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [media]);

    const filteredItems = feedItems.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'videos') return item.type === 'video' && !item.isAnalysis;
        if (filter === 'analysis') return item.isAnalysis;
        if (filter === 'announcements') return item.type === 'announcement' || item.type === 'article' || item.type === 'discussion';
        return item.type === filter;
    });

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-red-900/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        <Globe className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-none">Sutra</h2>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-400 bg-black/20 p-1.5 rounded-xl border border-white/5">
                    {(['all', 'videos', 'announcements'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 capitalize",
                                filter === f
                                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                    : 'hover:bg-white/5 hover:text-white border border-transparent'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <div className="w-12 h-12 border-2 border-white/10 border-t-[var(--color-accent-gold)] rounded-full animate-spin" />
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 pb-20">
                    {filteredItems.map((post) => (
                        <FeedCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-sm font-light tracking-wide">No updates found.</p>
                </div>
            )}
        </div>
    );
}

function FeedCard({ post }: { post: FeedItem }) {
    // Render different card styles based on type
    if (post.type === 'video') return <VideoCard post={post} />;
    return <ArticleCard post={post} />; // Fallback for all search results
}

function BrandIcon({ source, className }: { source: string; className?: string }) {
    switch (source.toLowerCase()) {
        case 'youtube':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF0000' }}>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        case 'reddit':
            return <MessageCircle className={cn(className, "text-orange-500")} />;
        case 'twitter':
            return <Twitter className={cn(className, "text-blue-400")} />;
        case 'instagram':
            return <Instagram className={cn(className, "text-pink-500")} />;
        case 'google':
            return <Newspaper className={cn(className, "text-blue-500")} />;
        case 'letterboxd':
            return <Film className={cn(className, "text-green-500")} />;
        default:
            return <Globe className={className} />;
    }
}

function VideoCard({ post }: { post: FeedItem }) {
    return (
        <div className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group">
            {/* Video Player - Interactive */}
            <div className="relative aspect-video bg-black">
                {post.videoId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${post.videoId}?autoplay=0&rel=0`}
                        title={post.title}
                        className="absolute inset-0 w-full h-full z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <iframe
                        src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(post.title + ' ' + (post.tags?.join(' ') || ''))}`}
                        title={post.title}
                        className="absolute inset-0 w-full h-full z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                    />
                )}
            </div>

            {/* Content & Source Link */}
            <div className="p-4 bg-[#0a0a0a]">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white line-clamp-2 leading-tight text-[15px] hover:text-[var(--color-primary)] transition-colors"
                    >
                        {post.title}
                    </a>
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-gray-500 hover:text-[#FF0000] transition-colors"
                        title="Watch on YouTube"
                    >
                        <BrandIcon source="youtube" className="w-6 h-6" />
                    </a>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                        <span className="font-medium">{post.author}</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    <span className="opacity-60">{post.timestamp}</span>
                </div>
            </div>
        </div>
    );
}

function ArticleCard({ post }: { post: FeedItem }) {
    return (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block bg-[#1a1a1a] border border-white/5 rounded-xl p-5 hover:bg-[#252525] transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <BrandIcon source={post.source} className="w-3 h-3" />
                    {post.author || post.domain || 'Source'}
                </div>
                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:underline">{post.title || post.content}</h3>

            <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed font-serif">
                {post.content}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
                <span>{post.timestamp}</span>
                <span className="text-[var(--color-primary)] group-hover:underline">View on {post.source}</span>
            </div>
        </a>
    );
}
