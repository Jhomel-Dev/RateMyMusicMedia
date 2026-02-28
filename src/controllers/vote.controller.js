import mongoose from 'mongoose';
import { VoteService } from '../services/vote.service.js';

const voteService = new VoteService();

export const castVote = async (req, res, next) => {
    try {
        const { trackId, isHot } = req.body;

        // Cláusulas de guarda para validación de entrada
        if (!trackId || isHot === undefined) {
            throw { status: 400, message: "trackId and isHot are required" };
        }

        if (!mongoose.Types.ObjectId.isValid(trackId)) {
            throw { status: 400, message: "Invalid trackId format" };
        }

        if (typeof isHot !== 'boolean') {
            throw { status: 400, message: "isHot must be a boolean" };
        }

        const result = await voteService.processVote(req.user.id, trackId, isHot);

        return res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};