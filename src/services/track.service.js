import cloudinary from "../config/cloudinary.js";
import Track from "../models/track.model.js";
import Vote from "../models/vote.model.js";

export class TrackService {

    async uploadTrack(userId, title, genre, fileBuffer) {
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
            title: title,
            genre: genre,
            audioUrl: cloudinaryResult.secure_url,
            eloScore: 1000
        });

        const savedTrack = await newTrack.save();

        return {
            id: savedTrack._id,
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

    async getFeed(userId, genres, limit) {
        const userVotes = await Vote.find({ voterId: userId }).select('trackId').lean();
        const votedTrackIds = userVotes.map(vote => vote.trackId);

        const query = { _id: { $nin: votedTrackIds } };

        if (genres && genres.length > 0) {
            query.genre = { $in: genres };
        }

        const tracks = await Track.find(query)
            .sort({ eloScore: -1 })
            .limit(limit)
            .lean();

        return tracks.map(track => {
            track.id = track._id.toString();
            delete track._id;
            return track;
        });
    }

    async getRankingsByGenre(genre) {
        const genreRegex = new RegExp(`^${genre}$`, 'i');

        const tracks = await Track.find({ genre: genreRegex })
            .select('title artistId audioUrl eloScore genre')
            .sort({ eloScore: -1 })
            .limit(50)
            .lean();

        return tracks.map(track => {
            track.id = track._id.toString();
            delete track._id;
            return track;
        });
    }
}   