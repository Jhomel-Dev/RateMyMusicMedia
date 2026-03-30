import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import { uploadTrack, getAllTracks, getFeed, getRankings, registerPlay, getMyUploads } from '../controllers/track.controller.js';

const trackRouter = Router();

trackRouter.get('/',
    getAllTracks
);

trackRouter.get('/me/uploads',
    authenticate,
    getMyUploads
);

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

trackRouter.post('/:trackId/play',
    registerPlay
);

export default trackRouter;