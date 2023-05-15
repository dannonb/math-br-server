import { io } from '../../../server.js' 

import {
    gameStatus,
    socketEvents,
    acknowledgementStatus,
    gameModes,
    difficulties,
    gameTypes
} from '../../constants.js'

import { createGameAndPlayerStates } from '../../functions/helpers.js'
import GameInstance from '../../classes/gameInstance.js'

import Player from '../../../models/player.js'
import Game from '../../../models/game.js'

const { joinEvents, customGameEvents } = socketEvents

// Join events
export const inviteFriendToCustomLobby = async function ({ creator, friendId, lobbyId }, cb) {
    const socket = this
    try {
        const friend = await Player.findById(friendId)
        if (!friend) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Could not find user.'
            })
        }
        friend.invites.push({ player: creator._id, lobby: lobbyId })
        await friend.save()
        cb({
            status: acknowledgementStatus.success,
            message: `${friend.username} has been invited.`
        })
        socket.to(friend.currentSocketId).emit(joinEvents.inviteFriendToCustomLobby)
        cb({
            status: acknowledgementStatus.success,
            message: `${friend.username} has been invited.`
        })
    } catch (e) {
        console.log(e)
    }
}

export const joinCustomLobby = async function ({ playerId, lobbyId, fromInvite }, cb) {
    const socket = this
    try {
        const player = await Player.findById(playerId)
        if (!player) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'An error has occured.'
            })
        }

        const game = await Game.findOne({ room: lobbyId })
        if (!game) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Game lobby does not exist.'
            })
        }

        if (game.status !== gameStatus.INLOBBY) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Game has already started.'
            }) 
        }

        socket.join(lobbyId)
        game.players.push(playerId)
        await game.save()

        if (fromInvite) {
            const invites = player.invites.filter(invite => invite !== lobbyId)
            player['invites'] = invites
            await player.save()
        }
        io.to(lobbyId).emit(joinEvents.playerJoinedCustomLobby)
        cb({
            status: acknowledgementStatus.success,
            message: `joining lobby: ${lobbyId}`
        })
    } catch (e) {
        console.log(e)
    }
}

export const createCustomGameLobby = async function ({ ownerId, lobbyId, rules }, cb) {
    const socket = this
    try {
        const owner = await Player.findById(ownerId)
        if (!owner) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'An error has occured.'
            })
        }
        if (await Game.exists({ room: lobbyId })) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Lobby with this name already exists.'
            })
        }

        const newGameData = {
            status: gameStatus.INLOBBY,
            room: lobbyId,
            creator: ownerId,
            rules: {
                room: lobbyId,
                gameMode: rules.gameMode || gameModes.BATTLEROYALE,
                isPractice: rules.isPractice || false,
                useBots: rules.useBots || false,
                rounds: rules.rounds || 3,
                eliminatePlayers: rules.eliminatePlayers || true,
                difficulty: rules.difficulty || difficulties.MEDIUM,
                type: rules.type || gameTypes.CLASSIC,
                creator: owner.username
            },
            players: [ownerId]
        }
        const game = new Game(newGameData)
        await game.save()

        socket.join(lobbyId)
        socket.to(lobbyId).emit(joinEvents.playerJoinedCustomLobby)
        cb({
            status: acknowledgementStatus.success,
            message: `joining lobby: ${lobbyId}`
        })

    } catch (e) {
        console.log(e)
    }
}

export const startCustomGame = async function ({ ownerId, lobbyId }, cb) {
    const socket = this
    try {
        const gameData = await Game.findOne({ room: lobbyId }).populate('players')
        if (!gameData) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Cannot start game.'
            })
        }

        if (gameData.creator.toString() !== ownerId) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Only the match creator can start the game.'
            })
        }

        if (gameData.status !== gameStatus.INLOBBY) {
            return cb({ 
                status: acknowledgementStatus.error,
                message: 'Game has already been started.'
            })
        }

        if (gameData.players.length < 2 && gameData.rules.isPractice === false) {
            return cb({ 
                status: acknowledgementStatus.error,
                message: 'Not enough players to start game. You can only play alone while in practice mode.'
            })
        }

        const gameState = createGameAndPlayerStates(gameData)
        //console.log(gameState)
        const game = new GameInstance(gameState, gameData)
        //console.log(game)
        game.init()
        if (game.gameState.status === gameStatus.READY) {
            game.playGame()
        }
        socket.to(lobbyId).emit(customGameEvents.creatorStartedCustomGame)
        cb({
            status: acknowledgementStatus.success,
            message: 'Starting game.' 
        })
    } catch (e) {
        console.log(e)
    }
}