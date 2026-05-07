import cloudinary from "../config/cloudinary.js";
import Track from "../models/track.model.js";
import Vote from "../models/vote.model.js";
import Favorite from "../models/favorite.model.js";

export class TrackService {

    async uploadTrack(userId, username, title, genre, fileBuffer) {
        let cloudinaryResult;
        try {
            const dataUri = `data:audio/wav;base64,${fileBuffer.toString('base64')}`;
            cloudinaryResult = await cloudinary.uploader.upload(dataUri, {
                folder: 'rate_my_music/tracks',
                resource_type: 'video',
                timeout: 600000
            });
        } catch (error) {
            console.error("[TrackService] Cloudinary upload FAILED. Raw error:", error);
            throw { status: 502, message: "Error uploading to Cloudinary: " + (error.message || JSON.stringify(error)) };
        }

        const newTrack = new Track({
            artistId: userId,
            artistName: username,
            title: title,
            genre: genre,
            audioUrl: cloudinaryResult.secure_url,
            eloScore: 1000
        });

        const savedTrack = await newTrack.save();

        return {
            id: savedTrack._id,
            artistName: savedTrack.artistName,
            title: savedTrack.title,
            genre: savedTrack.genre,
            audioUrl: savedTrack.audioUrl,
            eloScore: savedTrack.eloScore,
            createdAt: savedTrack.createdAt
        };
    }

    async getAllTracks() {
        const tracks = await Track.find()
            .sort({ eloScore: -1 })
            .lean();

        return tracks.map(track => {
            track.id = track._id.toString();
            delete track._id;
            return track;
        });
    }

    async registerPlay(trackId) {
        const track = await Track.findByIdAndUpdate(trackId, { $inc: { playCount: 1 } });
        if (!track) {
            throw { status: 404, message: "Track not found" };
        }
        return { message: "Play registered" };
    }

    async getFeed(userId, genres, limit, excludeIds = []) {
        const query = await this._buildFeedQuery(userId, genres, excludeIds);
        const tracks = await this._fetchFeedTracks(query, limit);
        const favoritedTrackIds = await this._getUserFavoriteIds(userId, tracks);

        return this._formatFeedResponse(tracks, favoritedTrackIds);
    }

    async _buildFeedQuery(userId, genres, excludeIds) {
        const userVotes = await Vote.find({ voterId: userId }).select('trackId').lean();
        const votedTrackIds = userVotes.map(vote => vote.trackId.toString());
        
        const combinedExcludeIds = [...new Set([...votedTrackIds, ...excludeIds])];
        
        const query = { 
            _id: { $nin: combinedExcludeIds },
            artistId: { $ne: userId }
        };
        
        if (genres && genres.length > 0) {
            query.genre = { $in: genres };
        }
        
        return query;
    }

    async _fetchFeedTracks(query, limit) {
        return await Track.find(query)
            .sort({ eloScore: -1 })
            .limit(limit)
            .lean();
    }

    async _getUserFavoriteIds(userId, tracks) {
        const trackIds = tracks.map(t => t._id);
        const userFavorites = await Favorite.find({
            userId: userId,
            trackId: { $in: trackIds }
        }).lean();
        
        return new Set(userFavorites.map(f => f.trackId.toString()));
    }

    _formatFeedResponse(tracks, favoritedTrackIds) {
        return tracks.map(track => {
            const idStr = track._id.toString();
            track.id = idStr;
            delete track._id;
            track.isFavoritedByMe = favoritedTrackIds.has(idStr);
            return track;
        });
    }

    async getRankingsByGenre(genre) {
        const genreRegex = new RegExp(`^${genre}$`, 'i');

        const tracks = await Track.find({ genre: genreRegex })
            .select('title artistId artistName audioUrl eloScore genre')
            .sort({ eloScore: -1 })
            .limit(50)
            .lean();

        return tracks.map(track => {
            track.id = track._id.toString();
            delete track._id;
            return track;
        });
    }

    async getMyUploads(userId) {
        const tracks = await Track.find({ artistId: userId })
            .sort({ createdAt: -1 })
            .lean();

        return tracks.map(track => {
            const idStr = track._id.toString();
            track.id = idStr;
            delete track._id;
            return track;
        });
    }
}   