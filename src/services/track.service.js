import cloudinary from "../config/cloudinary.js"
import Track from "../models/track.model.js"

export class UploadTrackService {

    async uploadTrack(userId, title, genre, fileBuffer) {
        let cloudinaryResult;
        try {
            cloudinaryResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'rate_my_music/tracks',
                        resource_type: 'video'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(fileBuffer);
            });
        } catch (error) {
            throw { status: 502, message: "Error uploading to Cloudinary" };
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
}