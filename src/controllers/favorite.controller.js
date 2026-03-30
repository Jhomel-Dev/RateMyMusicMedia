import { FavoriteService } from '../services/favorite.service.js';

const favoriteService = new FavoriteService();

export const toggleFavorite = async (req, res, next) => {
    try {
        const { trackId } = req.params;
        const userId = req.user.id; // From auth.middleware

        if (!trackId) {
            throw { status: 400, message: "trackId parameter is required" };
        }

        const result = await favoriteService.toggleFavorite(userId, trackId);
        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};
