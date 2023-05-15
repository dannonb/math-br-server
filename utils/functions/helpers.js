import { v4 as uuid4 } from 'uuid'

import { io } from "../../server.js"
import { 
    gameModes, 
    ranks, 
    gameStatus, 
    difficulties, 
    gameTypes,
    socketEvents, 
    acknowledgementStatus
} from "../constants.js";

import { getPlayersFromQueue } from '../matchmaking.js';

import Game from '../../models/game.js';
import GameInstance from '../classes/gameInstance.js';
const { joinEvents } = socketEvents

import { GameState, PlayerState, AIController } from "../classes/index.js"
import Player from '../../models/player.js';

export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const getSocketFromId = (socketId) => {
    return io.sockets.sockets.get(socketId)
}

export const determineRank = (mmr) => {
    console.log(typeof mmr)
    if (typeof mmr !== 'number') {
        throw new Error("MMR used was not a number")
    }
    switch(mmr) {
        case mmr > 100_000:
          return ranks.MATHEMATICIAN
          case mmr > 50_000:
            return ranks.CHAMPION  
        case mmr > 30_000:
            return ranks.DIAMOND
        case mmr > 10_000:
            return ranks.PLATINUM
        case mmr > 5_000:
            return ranks.GOLD
        case mmr > 1_000:
            return ranks.SILVER
        case mmr > 1:
            return ranks.BRONZE
        default:
          return ranks.UNRANKED
      }
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
        rules.isPractice,
        rules.useBots, 
        rules.rounds, 
        rules.eliminatePlayers, 
        rules.difficulty, 
        rules.type, 
        creator,
        aiController
    )

    players.forEach(async player => {
        const playerState = new PlayerState(
            room,
            player.username, 
            getSocketFromId(player.currentSocketId),
            false
        ) 
        gameState.addPlayer(playerState)
    })

    return gameState
}

export const createPublicMatchGameStateAndLobby = async (queue) => {
    const lobby = queue.gamemode + "-" + uuid4()
    const numOfPlayers = queue.gamemode === gameModes.BATTLEROYALE ? 100 : 2
    const gameData = {
        status: gameStatus.INLOBBY,
        room: lobby,
        creator: null,
        rules: {
            room: lobby,
            gameMode: queue.gamemode,
            isPractice: false,
            useBots: false,
            rounds: 3,
            eliminatePlayers: true,
            difficulty: difficulties.MEDIUM,
            type: gameTypes.CLASSIC
        },
        players: getPlayersFromQueue(queue, numOfPlayers).map((player) => player.playerId)
    }
    try {
        const game = new Game(gameData)
        await game.save()

        await game.populate('players')

        console.log(game)

        const gameState = createGameAndPlayerStates(game)
        console.log("GAMESTATE", gameState)
        const event = 
            gameState.gamemode === gameModes.BATTLEROYALE 
                ? joinEvents.joinBattleRoyaleLobby : joinEvents.joinDeathmatchLobby
        gameState.players.forEach((player) => {
            player.socket.join(lobby)
            player.socket.to(player.socket.id).emit(event)
        })

        console.log("RETURNIONG")

        const returnItem = {
            gameState,
            game
        }

        return new Promise((resolve) => {
            resolve(returnItem)
        })
    } catch (e) {
        console.log(e)
    }
}

export const startPublicMatch = (gameState, gameData) => {
    if (!gameState || !gameData) return;
    
    const game = new GameInstance(gameState, gameData)
    game.init()
    setTimeout(() => {
        if (game.gameState.status === gameStatus.READY) {
            game.playGame()
        }
    }, 3000)

    
}

export const rejoinPublicMatch = async ({ matchId }, cb) => {
    // rejoins match that is in progress if player gets disconnected
    try {
        const game  = await Game.find({ room: matchId })
        if (!game) {
            return cb({
                status: acknowledgementStatus.error,
                message: `Unable to rejoin match.`
            })
        } else if (game.status === gameStatus.FINISHED) {
            return cb({
                status: acknowledgementStatus.error,
                message: `Game is already over.`
            })
        }
        
    } catch (e) {
        console.log(e)
    }
}