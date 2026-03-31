import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { addComment, getComments, deleteComment } from '../controllers/comment.controller.js';

const commentRouter = Router();

// /api/comments/:trackId
commentRouter.get('/:trackId', getComments);
commentRouter.post('/:trackId', authenticate, addComment);

// /api/comments/:commentId
commentRouter.delete('/:commentId', authenticate, deleteComment);

export default commentRouter;
