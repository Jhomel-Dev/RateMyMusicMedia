import { FavoriteService } from '../services/favorite.service.js';

const favoriteService = new FavoriteService();

export const toggleFavorite = async (req, res, next) => {
    try {
        const { trackId } = req.params;
        const userId = req.user.id;

        if (!trackId) {
            throw { status: 400, message: "trackId parameter is required" };
        }

        const result = await favoriteService.toggleFavorite(userId, trackId);
        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

export const getMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tracks = await favoriteService.getMyFavorites(userId);
        return res.status(200).json(tracks);
    } catch (error) {
        next(error);
    }
};
