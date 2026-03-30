import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// A user can only favorite a track once
favoriteSchema.index({ userId: 1, trackId: 1 }, { unique: true });

const FavoriteModel = mongoose.model("Favorite", favoriteSchema);
export default FavoriteModel;
