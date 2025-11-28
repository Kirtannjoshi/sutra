'use client';

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SutraDoodle() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center w-[120px] h-[40px] cursor-pointer select-none group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg viewBox="0 0 450 120" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#bf953f" stopOpacity="1" />
                        <stop offset="25%" stopColor="#fcf6ba" stopOpacity="1" />
                        <stop offset="50%" stopColor="#b38728" stopOpacity="1" />
                        <stop offset="75%" stopColor="#fbf5b7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#aa771c" stopOpacity="1" />
                    </linearGradient>
                </defs>

                <g className="font-serif font-bold text-[80px] tracking-[12px]" style={{ fontFamily: '"Didot", "Playfair Display", serif' }}>
                    {/* Main Stitch Layer */}
                    <text x="20" y="80" className="stitch-char" style={{ animationDelay: '0s' }}>ร</text>
                    <text x="80" y="80" className="stitch-char" style={{ animationDelay: '0.2s' }}>μ</text>
                    <text x="140" y="80" className="stitch-char" style={{ animationDelay: '0.4s' }}>ƭ</text>
                    <text x="200" y="80" className="stitch-char" style={{ animationDelay: '0.6s' }}>૨</text>
                    <text x="260" y="80" className="stitch-char" style={{ animationDelay: '0.8s' }}>α</text>

                    {/* Shimmer Layer */}
                    <text x="20" y="80" className="shimmer-char" style={{ animationDelay: '0s' }}>ร</text>
                    <text x="80" y="80" className="shimmer-char" style={{ animationDelay: '0.2s' }}>μ</text>
                    <text x="140" y="80" className="shimmer-char" style={{ animationDelay: '0.4s' }}>ƭ</text>
                    <text x="200" y="80" className="shimmer-char" style={{ animationDelay: '0.6s' }}>૨</text>
                    <text x="260" y="80" className="shimmer-char" style={{ animationDelay: '0.8s' }}>α</text>
                </g>
            </svg>

            <style jsx>{`
                .stitch-char {
                    fill: none;
                    stroke: url(#gold-gradient);
                    stroke-width: 1.5px;
                    stroke-linecap: square;
                    stroke-dasharray: 450;
                    stroke-dashoffset: 450;
                    /* Default state: visible but static (or hidden if you prefer start from scratch) */
                    /* Let's keep it static gold */
                    stroke-dashoffset: 0; 
                    transition: all 0.5s ease;
                }
                
                /* Only animate on hover */
                .group:hover .stitch-char {
                    animation: stitch 3s cubic-bezier(0.6, 0.04, 0.98, 0.335) infinite;
                }
                
                .shimmer-char {
                    fill: none;
                    stroke: #fff;
                    stroke-width: 0.5px;
                    opacity: 0; /* Hidden by default */
                    stroke-dasharray: 450;
                    stroke-dashoffset: 450;
                }

                .group:hover .shimmer-char {
                    opacity: 0.3;
                    animation: stitch 3s cubic-bezier(0.6, 0.04, 0.98, 0.335) infinite, sparkle 2s linear infinite;
                }

                @keyframes stitch {
                    0% { stroke-dashoffset: 450; opacity: 0; }
                    30% { opacity: 1; }
                    50% { stroke-dashoffset: 0; }
                    80% { stroke-dashoffset: 0; opacity: 1; }
                    100% { stroke-dashoffset: -450; opacity: 0; }
                }

                @keyframes sparkle {
                    0% { opacity: 0.1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 0.1; }
                }
            `}</style>
        </div>
    );
}
