'use client';

import { useState } from 'react';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { Media } from '@/types/media';
import { listService } from '@/lib/services/list.service';
import RatingSelector from './RatingSelector';
import { type RatingLevel } from '@/lib/utils/ratings';

interface DiaryModalProps {
    media: Media;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function DiaryModal({ media, isOpen, onClose, onSave }: DiaryModalProps) {
    const [rating, setRating] = useState<RatingLevel | undefined>();
    const [review, setReview] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        listService.addToDiary({
            media,
            rating: rating || 'not_good_not_bad',
            review,
            date
        });
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Log to Diary</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    <img src={media.poster} alt={media.title} className="w-12 h-18 object-cover rounded shadow-md" />
                    <div>
                        <h3 className="font-bold text-white line-clamp-1">{media.title}</h3>
                        <span className="text-sm text-gray-400">{media.year}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Date Watched
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                            How was it?
                        </label>
                        <RatingSelector
                            currentRating={rating}
                            onRate={setRating}
                        />
                    </div>

                    {/* Review */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Review (Optional)
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors h-32 resize-none"
                            placeholder="What did you think?"
                        />
                    </div>

                    <button type="submit" className="w-full btn btn-primary py-4 rounded-xl font-bold text-lg">
                        Save Entry
                    </button>
                </form>
            </div>
        </div>
    );
}
