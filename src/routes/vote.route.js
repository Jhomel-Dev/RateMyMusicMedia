import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { castVote } from '../controllers/vote.controller.js';

const voteRouter = Router();

voteRouter.post('/', authenticate, castVote);

export default voteRouter;