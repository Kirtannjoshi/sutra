'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings, Edit, Clock, CheckCircle, Heart, List, BookOpen, Grid, Film, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import MediaGrid from '@/components/media/MediaGrid';
import { listService } from '@/lib/services/list.service';
import { List as ListType } from '@/types/list';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'collections' | 'diary'>('overview');
    const [userLists, setUserLists] = useState<ListType[]>([]);

    useEffect(() => {
        setUserLists(listService.getUserLists());
    }, []);

    // Mock stats (simplified)
    const stats = [
        { label: 'Watched', value: '0', icon: CheckCircle },
        { label: 'Watchlist', value: '0', icon: Clock },
        { label: 'Collections', value: userLists.length.toString(), icon: List },
        { label: 'Diary', value: '0', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 pt-24">
            {/* Profile Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-2 border-white/10 bg-surface overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                                KJ
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-surface border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-1">Kirtan Joshi</h1>
                                <p className="text-text-muted">@kirtanjoshi • Member since Nov 2025</p>
                            </div>
                            <button className="btn btn-secondary px-4 py-2 gap-2 text-sm font-medium">
                                <Settings className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-white">{stat.value}</span>
                                    <span className="text-sm text-text-muted">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="border-b border-white/5 mb-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: Grid },
                            { id: 'watchlist', label: 'Watchlist', icon: Clock },
                            { id: 'collections', label: 'Collections', icon: List },
                            { id: 'diary', label: 'Diary', icon: BookOpen },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative",
                                    activeTab === tab.id ? "text-white" : "text-text-muted hover:text-white"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {activeTab === 'overview' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Grid className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Welcome to your profile</h3>
                            <p className="text-gray-400">Your activity will appear here as you use the app.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'watchlist' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Your Watchlist is empty</h3>
                            <p className="text-gray-400 mb-4">Save movies and shows to watch later.</p>
                            <button onClick={() => router.push('/')} className="btn btn-primary px-6 py-2 rounded-full">
                                Browse Media
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'collections' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userLists.map((list) => (
                            <div
                                key={list.id}
                                onClick={() => router.push(`/list?id=${list.id}`)}
                                className="group relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-surface"
                            >
                                {list.coverImage ? (
                                    <Image
                                        src={list.coverImage}
                                        alt={list.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <List className="w-12 h-12 text-white/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">{list.title}</h3>
                                    <p className="text-sm text-gray-300">{list.items.length} items</p>
                                </div>
                            </div>
                        ))}

                        {/* Create New Collection */}
                        <button
                            onClick={() => router.push('/lists')}
                            className="aspect-[16/9] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-text-muted hover:text-white hover:border-white/30 transition-all bg-white/5"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Create Collection</span>
                        </button>
                    </div>
                )}

                {activeTab === 'diary' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">No diary entries yet</h3>
                            <p className="text-gray-400">Log movies and shows you've watched to create your diary.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
