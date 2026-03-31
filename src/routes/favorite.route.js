import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { toggleFavorite, getMyFavorites } from '../controllers/favorite.controller.js';

const favoriteRouter = Router();

favoriteRouter.get('/me', authenticate, getMyFavorites);
favoriteRouter.post('/:trackId/toggle', authenticate, toggleFavorite);

export default favoriteRouter;
