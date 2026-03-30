import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

// For fast lookup of comments per track, sorting by newest first
commentSchema.index({ trackId: 1, createdAt: -1 });

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
