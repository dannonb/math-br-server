import mongoose from 'mongoose'

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
})

const Game = mongoose.model('Game', gameSchema)

export default Game;