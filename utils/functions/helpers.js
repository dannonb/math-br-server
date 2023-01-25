import { io } from "../../server.js"
import { gameModes } from "../constants.js";

import { GameState, PlayerState, AIController } from "../classes/index.js"

export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const getSocketFromId = (socketId) => {
    return io.sockets.sockets.get(socketId)
}

export const createAIController = (rules, playerCount) => {
    if (!rules.isPractice || !rules.useBots) return null;

    if (rules.gameMode === gameModes.DEATHMATCH || playerCount > 1) return null;

    if (!!rules.isPractice && !!rules.useBots) {
        let count
        if (rules.gameMode === gameModes.DEATHMATCH) {
            count = 1
        } else {
            count = 100 - playerCount
        }
        return new AIController(room, rules.difficulty, count)
    }
}

export const createGameAndPlayerStates = (game) => {
    const { 
        room, 
        rules, 
        creator, 
        players 
    } = game

    const aiController = createAIController(rules, players.length)

    const gameState = new GameState(
        room, 
        rules.gameMode, 
        rules.rounds, 
        rules.eliminatePlayers, 
        rules.difficulty, 
        rules.type, 
        creator,
        aiController
    )

    for (let player in players) {
        const playerState = new PlayerState(
            room,
            player.username, 
            getSocketFromId(player.currentSocketId),
            false
        ) 
        gameState.addPlayer(playerState)
    }

    return gameState
}