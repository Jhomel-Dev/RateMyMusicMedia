import mongoose from "mongoose";

const trackModel = mongoose.Schema({
    artistId: { type: String, required: true },
    title:    { type: String, required: true, trim: true },
    audioUrl: { type: String, required: true },
    genre:    { type: String, required: true },
    eloScore: { type: Number, default: 1000 },
    createdAt:{ type: Date, default: Date.now }
})

trackSchema.index({ genre: 1, eloScore: -1 });

const TrackModel = mongoose.model("Track", trackSchema);
export default TrackModel;