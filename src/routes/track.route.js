import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import { uploadTrack, getFeed, getRankings } from '../controllers/track.controller.js';

const trackRouter = Router();

trackRouter.post('/upload',
    authenticate,
    uploadMiddleware.single('audio'),
    uploadTrack
);

trackRouter.get('/feed',
    authenticate,
    getFeed
);

trackRouter.get('/rankings/:genre',
    getRankings
);

export default trackRouter;