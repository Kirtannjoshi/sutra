'use client';

import { ExternalLink } from 'lucide-react';

interface ExternalLinksProps {
    title: string;
    imdbId: string;
    type: 'movie' | 'series' | 'anime';
}

export default function ExternalLinks({ title, imdbId, type }: ExternalLinksProps) {
    const links = [
        {
            name: 'Reddit',
            url: `https://www.reddit.com/search/?q=${encodeURIComponent(title + ' ' + type)}`,
            color: '#FF4500',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            )
        },
        {
            name: 'Letterboxd',
            url: `https://letterboxd.com/search/${encodeURIComponent(title)}/`,
            color: '#00E054',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            )
        },
        {
            name: 'Wikipedia',
            url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title + ' ' + type)}`,
            color: '#FFFFFF',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.09 23.25L9.34 14.9 6.5 23.25H2.25L8.5 5.75h3.25l3.5 10.5 3.5-10.5h3.25l6.25 17.5h-4.25l-2.84-8.35-2.75 8.35z" />
                </svg>
            )
        },
        {
            name: 'IMDb',
            url: `https://www.imdb.com/title/${imdbId}/`,
            color: '#F5C518',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8zM8.8 19H6.3V5h2.5v14zm-5.5 0H2V5h1.3v14zm11.1-8.5v5.6c0 1.6-1.1 2.9-2.9 2.9h-2.5V5h2.5c1.8 0 2.9 1.3 2.9 2.9v2.6zm5.6 8.5h-2.5V5h2.5v14z" />
                </svg>
            )
        },
        {
            name: 'Google',
            url: `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + type)}`,
            color: '#4285F4',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
            )
        }
    ];

    return (
        <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[var(--color-primary)] rounded-full" />
                Deep Dive
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 shadow-inner" style={{ color: link.color }}>
                                {link.icon}
                            </div>
                            <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">
                                {link.name}
                            </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                    </a>
                ))}
            </div>
        </div>
    );
}
