import Track from '../models/track.model.js';
import Vote from '../models/vote.model.js';
import { calculateNewElo } from '../utils/elo.js';

export class VoteService {
    async processVote(userId, trackId, isHot) {
        try {
            const track = await this._getTrackOrFail(trackId);
            const existingVote = await this._findExistingVote(userId, trackId);

            if (!existingVote) {
                return await this._registerNewVote(userId, track, isHot);
            }

            if (this._isSameVote(existingVote, isHot)) {
                return await this._removeVote(existingVote, track, isHot);
            }

            return await this._updateVote(existingVote, track, isHot);

        } catch (error) {
            this._handleVoteErrors(error);
        }
    }

    async getUserVotes(userId) {
        return await Vote.find({ voterId: userId }).lean();
    }

    async _getTrackOrFail(trackId) {
        const track = await Track.findById(trackId);
        if (!track) {
            throw { status: 404, message: "Track not found" };
        }
        return track;
    }

    async _findExistingVote(userId, trackId) {
        return await Vote.findOne({ trackId, voterId: userId });
    }

    _isSameVote(existingVote, isHot) {
        return existingVote.isHot === isHot;
    }

    async _registerNewVote(userId, track, isHot) {
        const vote = new Vote({
            trackId: track._id,
            voterId: userId,
            isHot: isHot
        });
        await vote.save();

        const newElo = calculateNewElo(track.eloScore, isHot);
        await this._updateTrackEloAndVoteCount(track._id, newElo, 1);

        return this._buildVoteResponse(vote._id, newElo, "Vote created");
    }

    async _removeVote(existingVote, track, isHot) {
        await Vote.deleteOne({ _id: existingVote._id });

        const reversedIsHot = !isHot;
        const newElo = calculateNewElo(track.eloScore, reversedIsHot);
        await this._updateTrackEloAndVoteCount(track._id, newElo, -1);

        return this._buildVoteResponse(null, newElo, "Vote removed");
    }

    async _updateVote(existingVote, track, isHot) {
        existingVote.isHot = isHot;
        await existingVote.save();

        const currentIsHot = isHot;
        const previousIsHot = !isHot;
        
        const revertedElo = calculateNewElo(track.eloScore, previousIsHot);
        const finalElo = calculateNewElo(revertedElo, currentIsHot);
        
        await this._updateTrackEloAndVoteCount(track._id, finalElo, 0);

        return this._buildVoteResponse(existingVote._id, finalElo, "Vote updated");
    }

    async _updateTrackEloAndVoteCount(trackId, eloScore, voteCountChange) {
        await Track.findByIdAndUpdate(trackId, { 
            $set: { eloScore: eloScore }, 
            $inc: { voteCount: voteCountChange } 
        });
    }

    _buildVoteResponse(voteId, newEloScore, message) {
        return {
            message,
            voteId: voteId ? voteId.toString() : null,
            newEloScore
        };
    }

    _handleVoteErrors(error) {
        if (error.code === 11000) {
            throw { status: 409, message: "Already voted" };
        }
        
        if (error.status) {
             throw error;
        }

        throw { status: 500, message: "Internal server error during voting" };
    }
}