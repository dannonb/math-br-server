import mongoose from 'mongoose'
import { gameStatus, times } from '../utils/constants.js'

const gameSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    room: {
        type: String,
        required: true,
        unique: true
    },
    rules: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.Mixed,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }]
},
{
    timestamps: true
})

gameSchema.statics.cleanupUnplayedCustomGames = async () => {
    const { deletedCount } = await Game.deleteMany({ 
        status: gameStatus.INLOBBY, 
        createdAt: { $lt: new Date(Date.now() - times.timeToRemoveGamesLeftInLobby)} 
    })
    console.log(`(Cleanup) Games removed due to inactivity: ${deletedCount}`)
}

gameSchema.statics.cleanupFinishedGames = async () => {

}

const Game = mongoose.model('Game', gameSchema)

export default Game;