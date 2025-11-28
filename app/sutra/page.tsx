'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, Image as ImageIcon, Video, Newspaper, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sutraService } from '@/lib/services/sutra.service';
import { SutraPost } from '@/types/sutra';
import { Media } from '@/types/media';

export default function SutraPage() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SutraPost[]>([]);
    const [activeTab, setActiveTab] = useState('all');

    // Mock "Trending" data for initial state
    useEffect(() => {
        // Fetch real trending topics
        sutraService.fetchFeed(undefined, 'all').then(data => setResults(data));
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        // Simulate "Connecting to Index..."
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, we'd search for the specific query.
        // Here, we'll just generate results for a "generic" hit or try to match known titles.
        const mockMedia: Media = {
            imdbID: 'search-result',
            title: query,
            year: '2024',
            poster: '',
            type: 'movie'
        };

        const data = await sutraService.fetchFeed(mockMedia, 'all');
        setResults(data);
        setIsSearching(false);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Header / Search Bar */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">Sutra</span>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-white transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search the cinematic universe..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-gray-500"
                        />
                    </form>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <button className="hover:text-white transition-colors">Images</button>
                        <button className="hover:text-white transition-colors">Videos</button>
                        <button className="hover:text-white transition-colors">News</button>
                    </nav>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-4 flex gap-6 text-sm border-t border-white/5 overflow-x-auto">
                    {['all', 'videos', 'news', 'images'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-3 border-b-2 transition-colors capitalize whitespace-nowrap",
                                activeTab === tab ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Indexing cinematic data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Left Column: Main Feed */}
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">
                                About {results.length} results ({Math.random().toFixed(2)} seconds)
                            </p>

                            {results.map((post) => (
                                <div key={post.id} className="group bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                                    <div className="flex items-start gap-4">
                                        {/* Icon based on source */}
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                            {post.source === 'youtube' && <Video className="w-5 h-5 text-red-500" />}
                                            {post.source === 'twitter' && <span className="text-lg font-bold">X</span>}
                                            {post.source === 'reddit' && <span className="text-lg font-bold text-orange-500">r/</span>}
                                            {post.source === 'google' && <Newspaper className="w-5 h-5 text-blue-400" />}
                                            {post.source === 'instagram' && <ImageIcon className="w-5 h-5 text-pink-500" />}
                                            {post.source === 'deviantart' && <ImageIcon className="w-5 h-5 text-green-500" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm text-white">{post.author}</span>
                                                <span className="text-xs text-gray-500">• {post.timestamp}</span>
                                            </div>

                                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="block group-hover:underline decoration-white/30 underline-offset-4">
                                                <h3 className="text-lg font-semibold text-blue-400 mb-2 truncate">{post.content.split(':')[0]}...</h3>
                                            </a>

                                            <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                                                {post.content}
                                            </p>

                                            {/* Visual Preview (Mock) */}
                                            {post.type === 'video' && (
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10 relative mt-3">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${post.videoId || ''}?autoplay=0&controls=0`}
                                                        className="w-full h-full pointer-events-none" // Preview only
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                                {post.tags?.map(tag => (
                                                    <span key={tag} className="hover:text-blue-400 cursor-pointer">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Column: Trending Leaks & News */}
                        <div className="hidden md:block md:col-span-4 space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 sticky top-24">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <h2 className="text-lg font-bold text-white">Trending Leaks</h2>
                                </div>

                                <div className="space-y-4">
                                    {results.slice(0, 5).map((post) => (
                                        <a
                                            key={post.id}
                                            href={post.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group/item"
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-300 group-hover/item:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                                        {post.content}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                                            {post.source === 'reddit' ? 'r/Leaks' : 'News'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-600">• {post.timestamp}</span>
                                                    </div>
                                                </div>
                                                {post.image && (
                                                    <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                                                        <img src={post.image} alt="" className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-opacity" />
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Hot Topics</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Marvel Leaks', 'GTA VI', 'Dune 3', 'Superman Legacy', 'Nintendo Switch 2'].map(tag => (
                                            <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium border border-white/5 transition-colors text-gray-300 hover:text-white">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
