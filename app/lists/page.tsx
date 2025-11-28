'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { List, Clock, CheckCircle, Pause, X, Plus, Folder, Globe, Lock, MoreVertical, Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import MediaGrid from '@/components/media/MediaGrid';
import { mockMovies } from '@/lib/services/mock-data.service';
import { listService } from '@/lib/services/list.service';
import { libraryService } from '@/lib/services/library.service';
import { List as ListType } from '@/types/list';

type ListTab = 'diary' | 'my_list';
type MyListSubTab = 'my_collection' | 'saved_collection';

export default function ListsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ListTab>('diary');
    const [myListSubTab, setMyListSubTab] = useState<MyListSubTab>('my_collection');
    const [userLists, setUserLists] = useState<ListType[]>([]);
    const [savedLists, setSavedLists] = useState<ListType[]>([]);
    const [diaryEntries, setDiaryEntries] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newListData, setNewListData] = useState({ title: '', description: '', isPublic: true });

    useEffect(() => {
        // Fetch lists and diary entries
        setUserLists(listService.getUserLists());
        setSavedLists(listService.getSavedLists());
        // Use LibraryService for watched log
        const watchedLog = libraryService.getWatchedLog();
        // Transform WatchedItem to Media-like object for MediaGrid if needed, 
        // or ensure MediaGrid can handle it. 
        // MediaGrid expects Media[]. WatchedItem has imdbID, title, poster, type.
        // We might need to map it or update MediaGrid.
        // Let's check MediaGrid props. It likely takes { id, title, poster, ... }
        // For now, let's map it to a compatible structure.
        const mappedLog = watchedLog.map(item => ({
            imdbID: item.imdbID,
            title: item.title,
            poster: item.poster,
            year: new Date(item.watchedAt).getFullYear().toString(), // Use watched year or fetch real year? 
            // Ideally we store year in WatchedItem too, but for now this is a fallback
            type: item.type
        }));
        setDiaryEntries(mappedLog);
    }, [activeTab, myListSubTab]);

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        const newList = listService.createList({
            title: newListData.title,
            description: newListData.description,
            isPublic: newListData.isPublic,
            tags: []
        });
        setUserLists([newList, ...userLists]);
        setIsCreateModalOpen(false);
        setNewListData({ title: '', description: '', isPublic: true });
    };

    const tabs: { id: ListTab; label: string; icon: any; color: string }[] = [
        { id: 'diary', label: 'Diary', icon: Clock, color: 'text-accent-gold' },
        { id: 'my_list', label: 'My List', icon: List, color: 'text-blue-500' },
    ];

    const myListSubTabs: { id: MyListSubTab; label: string }[] = [
        { id: 'my_collection', label: 'My Collection' },
        { id: 'saved_collection', label: 'Saved Collection' },
    ];

    const getCurrentLists = () => {
        if (activeTab === 'my_list') {
            return myListSubTab === 'my_collection' ? userLists : savedLists;
        }
        return [];
    };

    const currentLists = getCurrentLists();
    const isListView = activeTab === 'my_list';
    const isDiaryView = activeTab === 'diary';

    // Get media items from diary entries
    // diaryEntries is already mapped to Media-like objects in useEffect
    const diaryMedia = diaryEntries;

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Library</h1>
                        <p className="text-text-muted">Manage and track your media journey</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn btn-primary px-6 py-3 gap-2 rounded-full hover:scale-105 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                        Create List
                    </button>
                </div>

                {/* Main Tabs */}
                <div className="border-b border-white/5">
                    <div className="flex items-center gap-8 overflow-x-auto pb-1">
                        {tabs.map(({ id, label, icon: Icon, color }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={cn(
                                    'flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative whitespace-nowrap',
                                    activeTab === id ? "text-white" : "text-text-muted hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", activeTab === id && color)} />
                                {label}
                                {activeTab === id && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* My List Sub-tabs */}
                {activeTab === 'my_list' && (
                    <div className="mt-6 flex items-center gap-4">
                        {myListSubTabs.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setMyListSubTab(id)}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                    myListSubTab === id
                                        ? 'bg-white/10 text-white'
                                        : 'bg-transparent text-text-muted hover:bg-white/5 hover:text-white'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="min-h-[400px] mt-8">
                    {isListView ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                            {currentLists.map((list) => (
                                <div
                                    key={list.id}
                                    onClick={() => router.push(`/list?id=${list.id}`)}
                                    className="group relative cursor-pointer"
                                >
                                    {/* Minimal Card Design - Premium */}
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 relative shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
                                        {list.coverImage ? (
                                            <img src={list.coverImage} alt={list.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                                                <Folder className="w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors" />
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <h3 className="text-xl font-bold text-white line-clamp-2 mb-2 leading-tight tracking-tight group-hover:text-[var(--color-primary)] transition-colors">{list.title}</h3>
                                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                                                <span>{list.items.length} items</span>
                                                {list.isPublic && (
                                                    <Globe className="w-3 h-3 text-gray-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Top Right Badges */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            {list.creator.id === 'sutra-official' && (
                                                <div className="bg-[var(--color-primary)] text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-lg">
                                                    Official
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {myListSubTab === 'my_collection' && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="aspect-[3/4] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-text-muted hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm">Create New</span>
                                </button>
                            )}

                            {currentLists.length === 0 && myListSubTab !== 'my_collection' && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                                    <Bookmark className="w-12 h-12 mb-4 opacity-20" />
                                    <p>No lists found in this section.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Diary tab content - show real diary entries
                        diaryMedia.length > 0 ? (
                            <MediaGrid items={diaryMedia} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <Clock className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No diary entries yet</p>
                                <p className="text-sm mt-2">Mark movies as watched to see them here</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Create List Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Create Collection</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateList} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newListData.title}
                                    onChange={(e) => setNewListData({ ...newListData, title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="e.g., Mind-Bending Sci-Fi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={newListData.description}
                                    onChange={(e) => setNewListData({ ...newListData, description: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                                    placeholder="What's this collection about?"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${newListData.isPublic ? 'bg-green-500/20 text-green-500' : 'bg-gray-700/50 text-gray-400'}`}>
                                        {newListData.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="block font-bold text-white text-sm">Public Collection</span>
                                        <span className="text-xs text-gray-400">Visible on your profile and home feed</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newListData.isPublic}
                                        onChange={(e) => setNewListData({ ...newListData, isPublic: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            <button type="submit" className="w-full btn btn-primary py-4 rounded-xl font-bold text-lg">
                                Create Collection
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
