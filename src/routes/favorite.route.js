import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { toggleFavorite } from '../controllers/favorite.controller.js';

const favoriteRouter = Router();

// Endpoint specifically to toggle a favorite
favoriteRouter.post('/:trackId/toggle', authenticate, toggleFavorite);

export default favoriteRouter;
