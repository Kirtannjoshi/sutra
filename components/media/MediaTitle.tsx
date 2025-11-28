'use client';

import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface MediaTitleProps {
    title: string;
    genre?: string;
    className?: string;
    style?: CSSProperties;
}

export default function MediaTitle({ title, genre, className, style }: MediaTitleProps) {
    const { structureStyle, skinStyle, containerStyle } = getDualLayerStyle(title, genre);

    return (
        <div className={cn("relative inline-block select-none animate-slide-up", className)} style={containerStyle}>
            {/* Layer 1: Structure (The "Body" - Stroke, Shadow, Shape) */}
            <h1
                className="absolute inset-0 z-0 text-balance leading-[0.9] tracking-tighter"
                style={structureStyle}
                aria-hidden="true"
            >
                {title}
            </h1>

            {/* Layer 2: Skin (The "Face" - Gradient, Texture, Shine) */}
            <h1
                className="relative z-10 text-balance leading-[0.9] tracking-tighter"
                style={{ ...skinStyle, ...style }}
            >
                {title}
            </h1>
        </div>
    );
}

// --- DUAL-LAYER VIBE ENGINE ---
const getDualLayerStyle = (title: string, genre: string | undefined) => {
    const cleanTitle = title.toLowerCase();
    const genres = (genre || '').toLowerCase().split(',').map(g => g.trim());
    const mainGenre = genres[0] || 'default';
    const is = (g: string) => genres.includes(g);

    // Base Configuration
    const baseFont = 'clamp(2.5rem, 4vw, 4rem)';

    const common: CSSProperties = {
        fontSize: baseFont,
        lineHeight: '0.9',
        letterSpacing: '-0.02em',
        textTransform: 'none',
        fontWeight: '800',
        margin: 0,
        padding: 0,
    };

    // Default Fallback
    let structure: CSSProperties = {
        ...common,
        color: 'transparent',
        WebkitTextStroke: '2px rgba(255,255,255,0.1)',
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
    };

    let skin: CSSProperties = {
        ...common,
        color: '#ffffff',
    };

    // --- FRANCHISE MASTERY ---

    // Marvel
    if (cleanTitle.includes('avengers') || cleanTitle.includes('marvel') || cleanTitle.includes('iron man')) {
        const font = 'var(--font-black-ops)';
        structure = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '2px #ffffff', // White outline
            filter: 'drop-shadow(0 0 15px rgba(240, 19, 30, 0.6))', // Red Glow
        };
        skin = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(to bottom, #f0131e, #8a0b11)', // Marvel Red
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
        };
    }

    // Star Wars
    else if (cleanTitle.includes('star wars') || cleanTitle.includes('mandalorian') || cleanTitle.includes('jedi')) {
        const font = 'var(--font-orbitron)';
        structure = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '2px #d4b900', // Gold outline
            filter: 'drop-shadow(0 0 20px rgba(255, 232, 31, 0.5))', // Yellow Glow
            letterSpacing: '0.15em',
        };
        skin = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(to bottom, #ffe81f, #d4b900)', // Iconic Yellow
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            letterSpacing: '0.15em',
        };
    }

    // Batman / DC
    else if (cleanTitle.includes('batman') || cleanTitle.includes('dark knight') || cleanTitle.includes('joker')) {
        const font = 'var(--font-anton)';
        structure = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: '#000000', // Black body
            WebkitTextStroke: '1px #444',
            filter: 'drop-shadow(0 0 25px rgba(0,0,0,0.9))', // Heavy shadow
            letterSpacing: '0.1em',
        };
        skin = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(to bottom, #e0e0e0, #757575)', // Steel Gradient
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            letterSpacing: '0.1em',
        };
    }

    // Dune
    else if (cleanTitle.includes('dune')) {
        const font = 'var(--font-orbitron)';
        structure = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1px #e0c097',
            filter: 'drop-shadow(0 0 15px rgba(224, 192, 151, 0.2))',
            letterSpacing: '0.3em',
        };
        skin = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: '#e0c097', // Spice Sand
            letterSpacing: '0.3em',
        };
    }

    // Barbie
    else if (cleanTitle.includes('barbie')) {
        const font = 'var(--font-abril)';
        structure = {
            ...common,
            fontFamily: font,
            color: '#ffffff', // White backing
            filter: 'drop-shadow(4px 4px 0px #e0115f)', // Hard Pink Shadow
            transform: 'rotate(-3deg)',
            fontSize: 'clamp(3.5rem, 5vw, 5rem)',
        };
        skin = {
            ...common,
            fontFamily: font,
            color: '#ff69b4', // Hot Pink
            transform: 'rotate(-3deg)',
            fontSize: 'clamp(3.5rem, 5vw, 5rem)',
        };
    }

    // Stranger Things
    else if (cleanTitle.includes('stranger things')) {
        const font = 'var(--font-press-start)';
        structure = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '2px #990000',
            filter: 'drop-shadow(0 0 15px #ff0033)', // Neon Glow
            fontSize: 'clamp(1.8rem, 3vw, 3rem)',
            letterSpacing: '0.05em',
        };
        skin = {
            ...common,
            fontFamily: font,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1px #ff0033', // Neon Outline
            fontSize: 'clamp(1.8rem, 3vw, 3rem)',
            letterSpacing: '0.05em',
        };
    }

    // --- GENRE FALLBACKS ---
    else {
        switch (mainGenre) {
            case 'horror':
                structure = { ...common, fontFamily: 'var(--font-butcherman)', color: '#330000', filter: 'drop-shadow(2px 2px 0px #ff0000)' };
                skin = { ...common, fontFamily: 'var(--font-butcherman)', color: '#8a0303' };
                break;
            case 'sci-fi':
                structure = { ...common, fontFamily: 'var(--font-orbitron)', textTransform: 'uppercase', color: 'transparent', WebkitTextStroke: '1px #00ffff', filter: 'drop-shadow(0 0 10px #00ffff)' };
                skin = { ...common, fontFamily: 'var(--font-orbitron)', textTransform: 'uppercase', color: '#e0ffff' };
                break;
            case 'action':
                structure = { ...common, fontFamily: 'var(--font-black-ops)', textTransform: 'uppercase', fontStyle: 'italic', color: 'transparent', WebkitTextStroke: '1px white', filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))' };
                skin = { ...common, fontFamily: 'var(--font-black-ops)', textTransform: 'uppercase', fontStyle: 'italic', color: '#ffffff' };
                break;
            case 'comedy':
                structure = { ...common, fontFamily: 'var(--font-bangers)', color: '#000', filter: 'drop-shadow(2px 2px 0px #fff)' };
                skin = { ...common, fontFamily: 'var(--font-bangers)', color: '#ffd700' };
                break;
            default:
                structure = { ...common, fontFamily: 'var(--font-anton)', textTransform: 'uppercase', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' };
                skin = { ...common, fontFamily: 'var(--font-anton)', textTransform: 'uppercase', color: '#ffffff' };
                break;
        }
    }

    return { structureStyle: structure, skinStyle: skin, containerStyle: {} };
};
