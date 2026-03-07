import mongoose from 'mongoose';
import Track from '../models/track.model.js';
import Vote from '../models/vote.model.js';
import { calculateNewElo } from '../utils/elo.js';

export class VoteService {

    async processVote(userId, trackId, isHot) {
        try {
            const track = await Track.findById(trackId);

            if (!track) {
                throw { status: 404, message: "Track not found" };
            }

            const existingVote = await Vote.findOne({ trackId, voterId: userId });

            if (existingVote) {
                // If they click the same vote button again, meaning they are unvoting
                if (existingVote.isHot === isHot) {
                    await Vote.deleteOne({ _id: existingVote._id });

                    // Revert the Elo score change. If they originally voted hot, calculate new elo as if they voted not hot to reverse it.
                    track.eloScore = calculateNewElo(track.eloScore, !isHot);
                    await track.save();

                    return {
                        message: "Vote removed",
                        voteId: null,
                        newEloScore: track.eloScore
                    };
                }

                // If they are changing their vote
                existingVote.isHot = isHot;
                await existingVote.save();

                // Revert the old vote's affect, then apply the new vote's affect
                let tempElo = calculateNewElo(track.eloScore, !existingVote.isHot); // Since existingVote.isHot is now the NEW vote, we must reverse the OLD vote (which is !existingVote.isHot) to revert. Actually let's just do it directly.
                // old vote was !isHot. Reverting it means applying isHot.
                // new vote is isHot. Applying it means applying isHot.
                // So mathematically, changing your vote applies the same directional change TWICE.
                // Wait, if old was Hot (+32), reverting it is Not Hot (-32). New is Not Hot (-32). Total is -64. Yes.

                // Let's just use the helper twice for clarity.
                const revertedElo = calculateNewElo(track.eloScore, isHot); // Revert the old vote by applying the opposite (which is the new vote)
                track.eloScore = calculateNewElo(revertedElo, isHot); // Apply the actual new vote

                await track.save();

                return {
                    voteId: existingVote._id.toString(),
                    newEloScore: track.eloScore
                };
            }

            // New vote
            const vote = new Vote({
                trackId: trackId,
                voterId: userId,
                isHot: isHot
            });
            await vote.save();

            track.eloScore = calculateNewElo(track.eloScore, isHot);
            await track.save();

            return {
                voteId: vote._id.toString(),
                newEloScore: track.eloScore
            };

        } catch (error) {
            this._handleVoteErrors(error);
        }
    }

    async getUserVotes(userId) {
        try {
            const votes = await Vote.find({ voterId: userId }).lean();
            return votes;
        } catch (error) {
            throw error;
        }
    }

    _handleVoteErrors(error) {
        if (error.code === 11000) {
            throw { status: 409, message: "Already voted" };
        }
        throw error;
    }
}