import FavoriteModel from '../models/favorite.model.js';
import TrackModel from '../models/track.model.js';

export class FavoriteService {
    async toggleFavorite(userId, trackId) {
        const existing = await FavoriteModel.findOne({ userId, trackId });
        
        if (existing) {
            await FavoriteModel.deleteOne({ _id: existing._id });
            await TrackModel.findByIdAndUpdate(trackId, { $inc: { favoriteCount: -1 } });
            return { action: 'removed', isFavorited: false };
        }
        
        await FavoriteModel.create({ userId, trackId });
        await TrackModel.findByIdAndUpdate(trackId, { $inc: { favoriteCount: 1 } });
        return { action: 'added', isFavorited: true };
    }

    async getMyFavorites(userId) {
        const favorites = await FavoriteModel.find({ userId })
            .populate('trackId')
            .sort({ createdAt: -1 })
            .lean();
            
        return favorites.map(fav => {
            const track = fav.trackId;
            if (track) {
                const idStr = track._id.toString();
                track.id = idStr;
                delete track._id;
                track.isFavoritedByMe = true;
            }
            return track;
        }).filter(t => t !== null);
    }
}
