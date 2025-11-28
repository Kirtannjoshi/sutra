'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { omdbService } from '@/lib/services/omdb.service';
import { Media } from '@/types/media';
import SutraDoodle from './SutraDoodle';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(true); // Always show search bar
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<Media[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 2) {
                try {
                    const result = await omdbService.searchMedia(searchQuery);
                    setSuggestions(result.search.slice(0, 5));
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 md:left-20 right-0 z-[100] transition-all duration-300 border-b border-white/5',
                isScrolled ? 'bg-black/90 backdrop-blur-xl py-3 shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'
            )}
        >
            <div className="max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => {
                        // Click handling logic
                        const now = Date.now();
                        const lastClick = parseInt(sessionStorage.getItem('doodle_last_click') || '0');
                        const clicks = parseInt(sessionStorage.getItem('doodle_clicks') || '0');

                        if (now - lastClick > 500) {
                            // Reset if too slow
                            sessionStorage.setItem('doodle_clicks', '1');
                            sessionStorage.setItem('doodle_last_click', now.toString());

                            // Set timeout for single click action
                            setTimeout(() => {
                                const currentClicks = parseInt(sessionStorage.getItem('doodle_clicks') || '0');
                                if (currentClicks === 1) {
                                    router.push('/sutra');
                                }
                            }, 600);
                        } else {
                            // Increment clicks
                            const newClicks = clicks + 1;
                            sessionStorage.setItem('doodle_clicks', newClicks.toString());
                            sessionStorage.setItem('doodle_last_click', now.toString());

                            if (newClicks === 3) {
                                router.push('/about');
                                // Reset after action
                                sessionStorage.setItem('doodle_clicks', '0');
                            }
                        }
                    }}
                    className="flex items-center gap-1 group relative z-[101] cursor-pointer"
                >
                    <SutraDoodle />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 relative z-[101]">

                    <Link href="/sutra" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Sutra
                    </Link>

                    {/* Search Bar */}
                    <div className={cn(
                        "flex items-center bg-white/5 border border-white/10 rounded-full transition-all duration-300 overflow-visible relative",
                        isSearchOpen ? "w-72 px-4 py-2 bg-black/50 backdrop-blur-md border-white/20 shadow-lg" : "w-10 h-10 justify-center cursor-pointer hover:bg-white/10"
                    )}>
                        <Search
                            className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer hover:text-white transition-colors"
                            onClick={() => {
                                if (!isSearchOpen) {
                                    setIsSearchOpen(true);
                                    // Focus input after opening
                                    setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                                }
                            }}
                        />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch(e);
                            }}
                            className={cn("flex-1 ml-3 relative", !isSearchOpen && "hidden")}
                        >
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search movies, series..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder-gray-500 font-medium"
                                autoComplete="off"
                            />
                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && isSearchOpen && (
                                <div className="absolute top-full left-0 right-0 mt-4 w-[300px] -ml-4 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[102] max-h-[60vh] overflow-y-auto custom-scrollbar ring-1 ring-white/5">
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5">
                                        Suggestions
                                    </div>
                                    {suggestions.map((media) => (
                                        <Link
                                            key={media.imdbID}
                                            href={`/media?id=${media.imdbID}`}
                                            className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-none group"
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                                setSuggestions([]);
                                            }}
                                        >
                                            <div className="relative w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                                {media.poster !== 'N/A' && (
                                                    <Image src={media.poster} alt={media.title} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-white font-medium truncate text-sm group-hover:text-[var(--color-primary)] transition-colors">{media.title}</div>
                                                <div className="text-xs text-gray-400 capitalize">{media.year} • {media.type}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </form>
                        {isSearchOpen && (
                            <X
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors ml-2"
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsSearchOpen(false);
                                    setSuggestions([]);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
