import { CommentService } from '../services/comment.service.js';

const commentService = new CommentService();

export const addComment = async (req, res, next) => {
    try {
        const { trackId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;
        const username = req.user.username; 

        if (!text || text.trim() === '') {
            throw { status: 400, message: "Comment text cannot be empty" };
        }

        const comment = await commentService.addComment(trackId, userId, username, text);
        return res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const { trackId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const comments = await commentService.getCommentsByTrack(trackId, page, limit);
        return res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const result = await commentService.deleteComment(commentId, userId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
