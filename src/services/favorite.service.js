import FavoriteModel from '../models/favorite.model.js';
import TrackModel from '../models/track.model.js';

export class FavoriteService {
    async toggleFavorite(userId, trackId) {
        // Check if favorite exists
        const existing = await FavoriteModel.findOne({ userId, trackId });
        
        if (existing) {
            // Remove favorite and decrement counter
            await FavoriteModel.deleteOne({ _id: existing._id });
            await TrackModel.findByIdAndUpdate(trackId, { $inc: { favoriteCount: -1 } });
            return { action: 'removed', isFavorited: false };
        } else {
            // Add favorite and increment counter
            await FavoriteModel.create({ userId, trackId });
            await TrackModel.findByIdAndUpdate(trackId, { $inc: { favoriteCount: 1 } });
            return { action: 'added', isFavorited: true };
        }
    }
}
