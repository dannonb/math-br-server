import { io } from '../../../server.js' 

import {
    gameStatus,
    socketEvents,
    acknowledgementStatus
} from '../../constants.js'

import Player from '../../../models/player.js'
import Game from '../../../models/game.js'

const { joinEvents } = socketEvents

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
            name: lobbyId,
            owner: ownerId,
            gameRules: {
                room: lobbyId,
                gameMode: rules.gameMode,
                isPractice: rules.isPractice,
                useBots: rules.useBots,
                rounds: rules.rounds,
                eliminatePlayers: rules.eliminatePlayers,
                difficulty: rules.difficulty,
                type: rules.type,
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
        const game = await Game.findOne({ room: lobbyId })
        if (!game) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Cannot start game.'
            })
        }

        if (game.status !== gameStatus.INLOBBY) {
            return cb({ 
                status: acknowledgementStatus.error,
                message: 'Game has already been started.'
            })
        }

        if (game.owner !== ownerId) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Only the match creator can start the game'
            })
        }
        
    } catch (e) {
        console.log(e)
    }
}