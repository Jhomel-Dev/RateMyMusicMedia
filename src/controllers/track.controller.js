import { UploadTrackService } from '../services/track.service.js';

const uploadTrackService = new UploadTrackService();

export const uploadTrack = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Audio file is required" });
        }
        
        const { title, genre } = req.body;
        if (!title || !genre) {
            return res.status(400).json({ error: "Title and genre are required" });
        }

        const result = await uploadTrackService.uploadTrack(req.user.id, title, genre, req.file.buffer);

        return res.status(201).json(result);    

    } catch (error) {
        if (error.status === 502) {
            return res.status(502).json({ error: error.message });
        }
        
        console.error("Upload Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};