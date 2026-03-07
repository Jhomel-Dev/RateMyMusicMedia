import { TrackService } from '../services/track.service.js';

const trackService = new TrackService();

export const uploadTrack = async (req, res, next) => {
    try {
        console.log("[uploadTrack] Handler entered.");
        console.log("[uploadTrack] req.file:", req.file ? `YES (size: ${req.file.size} bytes, mimetype: ${req.file.mimetype})` : "NO");
        console.log("[uploadTrack] req.body:", JSON.stringify(req.body));
        console.log("[uploadTrack] req.user:", JSON.stringify(req.user));

        if (!req.file) {
            throw { status: 400, message: "Audio file is required" };
        }

        const { title, genre } = req.body;
        if (!title || !genre) {
            throw { status: 400, message: "Title and genre are required" };
        }

        console.log("[uploadTrack] Starting Cloudinary upload...");
        const result = await trackService.uploadTrack(req.user.id, req.user.username, title, genre, req.file.buffer);
        console.log("[uploadTrack] Cloudinary upload complete:", JSON.stringify(result));

        return res.status(201).json(result);

    } catch (error) {
        console.error("[uploadTrack] Error caught:", error);
        next(error);
    }
};

export const getAllTracks = async (req, res, next) => {
    try {
        const tracks = await trackService.getAllTracks();
        return res.status(200).json(tracks);
    } catch (error) {
        next(error);
    }
};

export const getFeed = async (req, res, next) => {
    try {
        const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : 5;

        if (isNaN(limitParam) || limitParam < 1 || limitParam > 10) {
            throw { status: 400, message: "Limit must be a number between 1 and 10" };
        }

        const userId = req.user.id;
        const genres = req.user.genres;

        const tracks = await trackService.getFeed(userId, genres, limitParam);

        if (tracks.length === 0) {
            return res.status(200).json({
                tracks: [],
                message: "No more tracks available"
            });
        }

        return res.status(200).json({ tracks });

    } catch (error) {
        next(error);
    }
};

export const getRankings = async (req, res, next) => {
    try {
        const { genre } = req.params;

        if (!genre || genre.trim() === '') {
            throw { status: 400, message: "Genre parameter is required" };
        }

        const rankings = await trackService.getRankingsByGenre(genre.trim());

        return res.status(200).json({ rankings });

    } catch (error) {
        next(error);
    }
};