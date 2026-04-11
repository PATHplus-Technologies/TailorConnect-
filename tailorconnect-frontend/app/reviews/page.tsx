"use client";

import { useEffect, useState } from 'react';
import { reviewService } from '@/services/reviews';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [formData, setFormData] = useState({ rating: 5, comment: '', tailor: '' }); // Simplified: User enters tailor ID for now or we list tails.

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            // Ideally we filter by what's relevant to user, or show all public reviews. 
            // For verify, show all.
            const data = await reviewService.getAll();
            setReviews(data);
        } catch (e) { }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Ratings & Reviews</h1>

            <div className="grid gap-6">
                {reviews.map((r: any) => (
                    <div key={r.id} className="bg-white p-6 rounded shadow border-l-4 border-yellow-400">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{'⭐'.repeat(r.rating)}</span>
                            <span className="text-gray-500 text-sm">by {r.client_username}</span>
                        </div>
                        <p className="text-gray-800">{r.comment}</p>
                    </div>
                ))}
                {reviews.length === 0 && <p>No reviews yet.</p>}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded border">
                <h3 className="font-bold mb-4">Simulate Leaving a Review</h3>
                <p className="text-sm text-gray-500 mb-4">Note: In the real app, this would be on an Order Summary page or Tailor Profile.</p>

                {/* Simple inline form for testing purpose */}
                <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        await reviewService.create({ ...formData, tailor: parseInt(formData.tailor) });
                        loadReviews();
                        setFormData({ ...formData, comment: '' });
                    } catch (e) { alert('Form error'); }
                }}>
                    <div>
                        <label className="block text-sm">Tailor ID</label>
                        <input className="border p-1" value={formData.tailor} onChange={e => setFormData({ ...formData, tailor: e.target.value })} type="number" required />
                    </div>
                    <div>
                        <label className="block text-sm">Rating</label>
                        <select className="border p-1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">Comment</label>
                        <textarea className="border p-1 w-full" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} required />
                    </div>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded">Submit Review</button>
                </form>
            </div>
        </div>
    );
}
