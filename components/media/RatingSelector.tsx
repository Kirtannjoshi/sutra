'use client';

import { useState } from 'react';
import { RATINGS, RATING_LEVELS, type RatingLevel } from '@/lib/utils/ratings';
import { cn } from '@/lib/utils';

interface RatingSelectorProps {
    currentRating?: RatingLevel;
    onRate: (rating: RatingLevel) => void;
    className?: string;
}

export default function RatingSelector({ currentRating, onRate, className }: RatingSelectorProps) {
    const [hoveredRating, setHoveredRating] = useState<RatingLevel | null>(null);

    const displayRating = hoveredRating || currentRating;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Rating Display */}
            {displayRating && (
                <div className="text-center">
                    <div className="text-4xl mb-2">{RATINGS[displayRating].emoji}</div>
                    <div className={cn('text-xl font-bold', RATINGS[displayRating].color)}>
                        {RATINGS[displayRating].label}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        {RATINGS[displayRating].description}
                    </div>
                </div>
            )}

            {/* Rating Buttons */}
            <div className="flex flex-col gap-2">
                {RATING_LEVELS.map((level) => {
                    const rating = RATINGS[level];
                    const isSelected = currentRating === level;
                    const isHovered = hoveredRating === level;

                    return (
                        <button
                            key={level}
                            onClick={() => onRate(level)}
                            onMouseEnter={() => setHoveredRating(level)}
                            onMouseLeave={() => setHoveredRating(null)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all',
                                isSelected
                                    ? 'bg-white/10 border-white/20'
                                    : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10',
                                isHovered && 'scale-105'
                            )}
                        >
                            <span className="text-2xl">{rating.emoji}</span>
                            <div className="flex-1 text-left">
                                <div className={cn('font-bold', rating.color)}>
                                    {rating.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {rating.description}
                                </div>
                            </div>
                            {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
