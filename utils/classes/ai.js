import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator"

import { randomNumber } from "../functions/helpers.js"
import { difficulties } from "../constants.js"
import PlayerState from "./playerstate.js"

class AIController {
    constructor(
        room,
        difficulty = difficulties.MEDIUM,
        count
    ) {
        this.room = room
        this.difficulty = difficulty
        this.count = count
        this.bots = []
    }

    getBots() {
        return this.bots
    }

    createBotPlayerStates() {
        const playerStates = []
        for (let i = 0; i < this.count; i++) {
            const botUsername = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
            const playerState = new PlayerState(this.room, botUsername, null, true)
            playerStates.push(playerState)
            this.bots.push(playerState.playerStateId)
        }
        return playerStates
    }

    

}

export default AIController;