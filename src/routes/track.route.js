import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth.Middleware.js';
import { uploadMiddleware } from '../middlewares/upload.Middleware.js';
import { uploadTrack } from '../controllers/track.controller.js';

const trackRouter = Router();

trackRouter.post('/upload', 
    authenticate, 
    requireRole('Artist'), 
    uploadMiddleware.single('audio'), 
    uploadTrack
);

export default trackRouter;