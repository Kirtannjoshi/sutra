'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Check, Lock, Globe } from 'lucide-react';
import { Media } from '@/types/media';
import { List } from '@/types/list';
import { listService } from '@/lib/services/list.service';

interface AddToListModalProps {
    media: Media;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddToListModal({ media, isOpen, onClose }: AddToListModalProps) {
    const [lists, setLists] = useState<List[]>([]);
    const [newListName, setNewListName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLists(listService.getUserLists());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;

        const newList = listService.createList({
            title: newListName,
            description: '',
            isPublic: isPublic,
            tags: []
        });
        listService.addMediaToList(newList.id, media);
        setLists(listService.getUserLists());
        setNewListName('');
        setIsCreating(false);
        // Don't close, let user see it's added
    };

    const handleToggleList = (listId: string) => {
        const list = lists.find(l => l.id === listId);
        if (!list) return;

        const isAdded = list.items.some(i => i.imdbID === media.imdbID);

        if (isAdded) {
            listService.removeMediaFromList(listId, media.imdbID);
        } else {
            listService.addMediaToList(listId, media);
        }
        setLists([...listService.getUserLists()]); // Refresh state
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md bg-[var(--color-surface)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Add to List</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Existing Lists */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {lists.length === 0 && !isCreating && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No lists created yet.</p>
                            </div>
                        )}

                        {lists.map((list) => {
                            const isAdded = list.items.some(i => i.imdbID === media.imdbID);
                            return (
                                <button
                                    key={list.id}
                                    onClick={() => handleToggleList(list.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isAdded
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isAdded ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-500'
                                            }`}>
                                            {isAdded && <Check className="w-3 h-3 text-black" />}
                                        </div>
                                        <div className="text-left">
                                            <span className={`block font-medium ${isAdded ? 'text-[var(--color-primary)]' : 'text-white'}`}>
                                                {list.title}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                {list.items.length} items • {list.isPublic ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                    </div>
                                    {list.isPublic ? <Globe className="w-4 h-4 text-gray-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Create New List Form */}
                    {isCreating ? (
                        <form onSubmit={handleCreateList} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 animate-fade-in">
                            <input
                                type="text"
                                placeholder="List Name"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]"
                                autoFocus
                            />
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`flex items-center gap-2 text-sm ${isPublic ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}
                                >
                                    {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    {isPublic ? 'Public List' : 'Private List'}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newListName.trim()}
                                        className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-black font-bold rounded-lg disabled:opacity-50"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 flex items-center justify-center gap-2 text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)]/10 rounded-xl transition-colors border border-dashed border-[var(--color-primary)]/30"
                        >
                            <Plus className="w-5 h-5" />
                            Create New List
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
