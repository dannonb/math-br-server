import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
    gameState: {

    }
})

const Game = mongoose.model('Game', gameSchema)

export default Game;