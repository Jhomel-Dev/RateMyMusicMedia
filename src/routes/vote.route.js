import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { castVote, getUserVotes } from '../controllers/vote.controller.js';

const voteRouter = Router();

voteRouter.get('/', authenticate, getUserVotes);
voteRouter.post('/', authenticate, castVote);

export default voteRouter;