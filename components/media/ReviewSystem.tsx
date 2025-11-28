'use client';

import { useState, useEffect } from 'react';
import { Frown, Meh, ThumbsUp, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSystemProps {
    id: string;
    title?: string;
    className?: string;
}

type RatingTier = 'horrible' | 'not-bad' | 'good' | 'cinema' | null;

interface Tier {
    id: NonNullable<RatingTier>;
    label: string;
    icon: any;
    color: string;
    glow: string;
}

function getMockStats(id: string) {
    if (!id) return { horrible: 0, 'not-bad': 0, good: 0, cinema: 0 };
    // Simple deterministic random based on ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    const rand = () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };

    return {
        horrible: Math.floor(rand() * 500) + 50,
        'not-bad': Math.floor(rand() * 1000) + 200,
        good: Math.floor(rand() * 2000) + 500,
        cinema: Math.floor(rand() * 800) + 100,
    };
}

export default function ReviewSystem({ id, title = "Rate this Title", className }: ReviewSystemProps) {
    const [rating, setRating] = useState<RatingTier>(null);
    const [stats, setStats] = useState<Record<string, number>>({ horrible: 0, 'not-bad': 0, good: 0, cinema: 0 });

    useEffect(() => {
        const saved = localStorage.getItem(`rating-${id}`);
        if (saved) setRating(saved as RatingTier);
        setStats(getMockStats(id));
    }, [id]);

    const handleRate = (tier: RatingTier) => {
        const prevRating = rating;
        const isUndo = prevRating === tier;
        const newRating = isUndo ? null : tier;

        setRating(newRating);

        if (newRating) {
            localStorage.setItem(`rating-${id}`, newRating);
        } else {
            localStorage.removeItem(`rating-${id}`);
        }

        setStats(prev => {
            const newStats = { ...prev };
            if (prevRating && !isUndo) newStats[prevRating]--;
            if (prevRating && isUndo) newStats[prevRating]--;
            if (newRating) newStats[newRating]++;
            return newStats;
        });
    };

    const tiers = [
        {
            id: 'horrible',
            label: 'Horrible',
            icon: Frown,
            color: 'text-red-500',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)] bg-red-500/10'
        },
        {
            id: 'not-bad',
            label: 'Not Good But Not Bad',
            icon: Meh,
            color: 'text-yellow-500',
            glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)] bg-yellow-500/10'
        },
        {
            id: 'good',
            label: 'Good',
            icon: ThumbsUp,
            color: 'text-blue-500',
            glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-blue-500/10'
        },
        {
            id: 'cinema',
            label: 'Absolute Cinema',
            icon: Clapperboard,
            color: 'text-[var(--color-accent-gold)]',
            glow: 'shadow-[0_0_40px_rgba(255,215,0,0.4)] bg-[var(--color-accent-gold)]/10'
        },
    ] as const;

    const totalVotes = Object.values(stats).reduce((a, b) => a + b, 0);

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-light text-white tracking-tight">{title}</h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                    {totalVotes.toLocaleString()} Ratings
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = rating === tier.id;

                    return (
                        <button
                            key={tier.id}
                            onClick={() => handleRate(tier.id as RatingTier)}
                            className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                                isSelected
                                    ? `bg-white/5 border-white/20 ${tier.color}`
                                    : "bg-transparent border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300"
                            )}
                        >
                            {isSelected && (
                                <div className={cn("absolute inset-0 opacity-20", tier.glow)} />
                            )}
                            <Icon className={cn("w-6 h-6 relative z-10", isSelected ? "fill-current" : "")} />
                            <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">{tier.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Minimal Stats Bar */}
            <div className="flex h-1 w-full rounded-full overflow-hidden bg-white/5">
                {tiers.map((tier) => {
                    const count = stats[tier.id] || 0;
                    const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                    const isSelected = rating === tier.id;

                    return (
                        <div
                            key={tier.id}
                            className={cn(
                                "h-full transition-all duration-500",
                                isSelected ? "bg-white" : "bg-gray-600"
                            )}
                            style={{ width: `${percentage}%`, opacity: isSelected ? 1 : 0.3 }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
