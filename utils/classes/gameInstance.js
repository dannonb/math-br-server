import { io } from "../../server.js"
import { gameStatus, socketEvents } from "../constants.js"

const { gameEvents } = socketEvents

class GameInstance {
    constructor(gameState, gameData) {
        this.gameState = gameState
        this.gameData = gameData // game info saved in db
    }

    async saveCurrentStateInDb() {
        this.gameData.state = this.gameState.serialize()
        try {
            await this.gameData.save()
        } catch (error) {
            console.log(error)
        }
    }

    async setGameStatus(status) {
        this.gameData.status = status
        this.gameState.status = status
    }

    async init() {
        if (!!this.gameState.aiController) {
            const botPlayerStates = this.gameState.aiController.createBotPlayerStates()
            this.gameState.players.concat(botPlayerStates)
        }
        this.setGameStatus(gameStatus.READY)
        this.saveCurrentStateInDb()
        io.to(this.gameState.room).emit(gameEvents.joinMatch)
    }

    async loop() {
        
    }

    async end() {
        this.setGameStatus(gameStatus.FINISHED)
    }

    async playGame() {
        this.setGameStatus(gameStatus.INPROGRESS)
        this.saveCurrentStateInDb()
        io.to(this.gameState.room).emit(gameEvents.startMatch)
    }
}

export default GameInstance