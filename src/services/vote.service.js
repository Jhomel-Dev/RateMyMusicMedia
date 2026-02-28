import mongoose from 'mongoose';
import Track from '../models/track.model.js';
import Vote from '../models/vote.model.js';
import { calculateNewElo } from '../utils/elo.js';

export class VoteService {
    
    async processVote(userId, trackId, isHot) {
        const session = await mongoose.startSession();
        
        try {
            session.startTransaction();
            
            const track = await Track.findById(trackId).session(session);
            
            if (!track) {
                throw { status: 404, message: "Track not found" };
            }

            const vote = new Vote({
                trackId: trackId,
                voterId: userId,
                isHot: isHot
            });
            await vote.save({ session });

            track.eloScore = calculateNewElo(track.eloScore, isHot);
            await track.save({ session });

            await session.commitTransaction();

            return {
                voteId: vote._id.toString(),
                newEloScore: track.eloScore
            };

        } catch (error) {
            await session.abortTransaction();
            this._handleVoteErrors(error);
        } finally {
            session.endSession();
        }
    }

    _handleVoteErrors(error) {
        if (error.code === 11000) {
            throw { status: 409, message: "Already voted" };
        }
        throw error;
    }
}