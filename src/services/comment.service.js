import CommentModel from '../models/comment.model.js';
import TrackModel from '../models/track.model.js';

export class CommentService {
    async addComment(trackId, userId, username, text) {
        // Create the comment
        const comment = await CommentModel.create({
            trackId,
            userId,
            username,
            text
        });

        // Increment track commentCount
        await TrackModel.findByIdAndUpdate(trackId, { $inc: { commentCount: 1 } });

        return comment;
    }

    async getCommentsByTrack(trackId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const comments = await CommentModel.find({ trackId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return comments;
    }

    async deleteComment(commentId, userId) {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            throw { status: 404, message: "Comment not found" };
        }

        if (comment.userId !== userId) {
            throw { status: 403, message: "Unauthorized to delete this comment" };
        }

        await CommentModel.deleteOne({ _id: commentId });
        await TrackModel.findByIdAndUpdate(comment.trackId, { $inc: { commentCount: -1 } });

        return { message: "Comment deleted successfully" };
    }
}
