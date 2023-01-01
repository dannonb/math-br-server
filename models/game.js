import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gameState: {
        type: mongoose.Schema.Types.Mixed
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }]
})

const Game = mongoose.model('Game', gameSchema)

export default Game;