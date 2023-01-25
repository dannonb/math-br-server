import { io } from "../../server.js"
import { gameStatus } from "../constants.js"

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
        await this.gameData.save()
    }

    async init() {
        if (!!this.gameState.aiController) {
            const botPlayerStates = this.gameState.aiController.createBotPlayerStates()
            this.gameState.players.concat(botPlayerStates)
        }
        this.saveCurrentStateInDb()
        this.setGameStatus(gameStatus.INPROGRESS)
        io.to(this.gameState.room).emit()
    }

    async loop() {
        
    }

    async end() {
        this.setGameStatus(gameStatus.FINISHED)
    }

    async playGame() {

    }
}

export default GameInstance