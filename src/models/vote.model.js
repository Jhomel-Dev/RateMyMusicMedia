import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    trackId:   { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    voterId:   { type: String, required: true },
    isHot:     { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ trackId: 1, voterId: 1 }, { unique: true });

const VoteModel = mongoose.model("Vote", voteSchema);
export default VoteModel;