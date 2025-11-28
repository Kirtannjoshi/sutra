'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { List } from '@/types/list';
import { listService } from '@/lib/services/list.service';
import MediaGrid from '@/components/media/MediaGrid';
import { ArrowLeft, Edit2, Trash2, Share2, Heart, Bookmark, Globe, Lock, Save } from 'lucide-react';
import Image from 'next/image';

function ListDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [list, setList] = useState<List | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '' });

    useEffect(() => {
        if (id) {
            const fetchedList = listService.getListById(id);
            if (fetchedList) {
                setList(fetchedList);
                setEditData({ title: fetchedList.title, description: fetchedList.description });
            } else {
                // Handle not found
                router.push('/lists');
            }
        }
    }, [id, router]);

    const handleSave = () => {
        if (list) {
            listService.updateList(list.id, editData);
            setList({ ...list, ...editData });
            setIsEditing(false);
        }
    };

    const handleRemoveItem = (mediaId: string) => {
        if (list) {
            listService.removeMediaFromList(list.id, mediaId);
            setList({ ...list, items: list.items.filter(i => i.imdbID !== mediaId) });
        }
    };

    if (!list) return null;

    const isOwner = list.creator.id === 'current-user';

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
                {/* Back Button */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Lists
                </button>

                {/* Header */}
                <div className="relative rounded-2xl overflow-hidden bg-surface border border-white/5 p-8 md:p-12">
                    {/* Background Blur */}
                    <div className="absolute inset-0 overflow-hidden">
                        {list.coverImage && (
                            <Image
                                src={list.coverImage}
                                alt="Background"
                                fill
                                className="object-cover opacity-20 blur-xl"
                                unoptimized
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        {/* Cover Image */}
                        <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-black/50">
                            {list.coverImage ? (
                                <Image src={list.coverImage} alt={list.title} width={300} height={450} className="w-full h-full object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <Globe className="w-16 h-16" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {list.isPublic ? (
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-1">
                                            <Globe className="w-3 h-3" /> Public
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-bold border border-gray-500/20 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Private
                                        </span>
                                    )}
                                    {list.creator.id === 'sutra-official' && (
                                        <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/20">
                                            Sutra Official
                                        </span>
                                    )}
                                </div>

                                {isOwner && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                listService.toggleListPrivacy(list.id);
                                                setList({ ...list, isPublic: !list.isPublic });
                                            }}
                                            className="btn btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10"
                                            title={list.isPublic ? "Make Private" : "Make Public"}
                                        >
                                            {list.isPublic ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                            className="btn btn-secondary px-4 py-2 rounded-lg flex items-center gap-2"
                                        >
                                            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                            {isEditing ? 'Save' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this list?')) {
                                                    listService.deleteList(list.id);
                                                    router.push('/lists');
                                                }
                                            }}
                                            className="btn btn-danger px-4 py-2 rounded-lg flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete List"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 mb-6">
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-3xl font-bold text-white focus:border-primary focus:outline-none"
                                    />
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-gray-300 focus:border-primary focus:outline-none h-24 resize-none"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{list.title}</h1>
                                    <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-3xl">{list.description}</p>
                                </>
                            )}

                            <div className="flex flex-wrap items-center gap-6 md:gap-12 border-t border-white/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-white/20">
                                        {list.creator.avatar ? (
                                            <Image src={list.creator.avatar} alt={list.creator.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                                                {list.creator.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-400">Created by</span>
                                        <span className="block font-bold text-white">{list.creator.name}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400">Items</span>
                                        <span className="font-bold text-white text-lg">{list.items.length}</span>
                                    </div>

                                    {/* Like Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (listService.toggleLike(list.id)) {
                                                setList({ ...list, likes: list.likes + 1 });
                                            }
                                        }}
                                        className="flex flex-col group cursor-pointer"
                                    >
                                        <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors">Likes</span>
                                        <span className="font-bold text-white text-lg flex items-center gap-2 group-hover:text-red-500 transition-colors">
                                            <Heart className="w-5 h-5 group-hover:fill-current transition-all group-active:scale-90" /> {list.likes}
                                        </span>
                                    </button>

                                    {/* Save Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const isSaved = listService.toggleSaveList(list.id);
                                            setList({ ...list, saves: isSaved ? list.saves + 1 : Math.max(0, list.saves - 1) });
                                        }}
                                        className="flex flex-col group cursor-pointer"
                                    >
                                        <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">Saves</span>
                                        <span className={`font-bold text-lg flex items-center gap-2 transition-colors ${listService.isListSaved(list.id) ? 'text-purple-500' : 'text-white group-hover:text-purple-500'}`}>
                                            <Bookmark className={`w-5 h-5 transition-all group-active:scale-90 ${listService.isListSaved(list.id) ? 'fill-current' : ''}`} />
                                            {list.saves}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">List Items</h2>
                    {list.items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {list.items.map((item) => (
                                <div key={item.imdbID} className="relative group">
                                    {/* Use MediaGrid item component or recreate simplified version */}
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-surface relative cursor-pointer hover:border-white/20 transition-all" onClick={() => router.push(`/media?id=${item.imdbID}`)}>
                                        <Image
                                            src={item.poster}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <h3 className="font-bold text-white text-sm line-clamp-2">{item.title}</h3>
                                            <span className="text-xs text-gray-400">{item.year}</span>
                                        </div>
                                    </div>

                                    {isOwner && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.imdbID); }}
                                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <p className="text-gray-400 mb-4">This list is empty.</p>
                            {isOwner && (
                                <button onClick={() => router.push('/')} className="btn btn-primary px-6 py-2 rounded-full">
                                    Browse Media
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ListDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div></div>}>
            <ListDetailContent />
        </Suspense>
    );
}
