import {
    gameStatus,
    socketEvents,
    acknowledgementStatus
} from '../../constants.js'

import Player from '../../../models/player.js'
import Game from '../../../models/game.js'

import { GameState, PlayerState } from '../../classes'

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

        const game = await Game.findOne({ name: lobbyId })
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
        if (fromInvite) {
            const invites = player.invites.filter(invite => invite !== lobbyId)
            player['invites'] = invites
            await player.save()
        }
        socket.to(lobbyId).broadcast.emit(joinEvents.playerJoinedCustomLobby)
        cb({
            status: acknowledgementStatus.success,
            message: `joining lobby: ${lobbyId}`
        })
    } catch (e) {
        console.log(e)
    }
}

// export const joinCustomGame = async function ({ playerId, gameId }, cb) {
//     const socket = this
//     try {
//         const player = await Player.findById(playerId)
//         if (!player) {
//             return cb({
//                 status: acknowledgementStatus.error,
//                 message: 'An error has occured.'
//             })
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }

export const startCustomGame = async function ({ ownerId, lobbyId }, cb) {
    const socket = this
    try {
        socket.to(lobbyId).emit()
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
        if (await Game.exists({ name: lobbyId })) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'Lobby with this name already exists.'
            })
        }
        const gameState = new GameState(
            lobbyId, 
            rules.gameMode, 
            rules.rounds, 
            rules.difficulty, 
            rules.type, 
            owner.username
        )

        const playerState = new PlayerState(
            lobbyId, 
            owner.username, 
            socket
        )

        gameState.addPlayer(playerState)

        const newGameData = {
            status: gameStatus.INLOBBY,
            name: lobbyId,
            gameState,
            players: [ownerId]
        }
        const game = new Game(newGameData)
        await game.save()

        socket.join(lobbyId)
        socket.to(lobbyId).broadcast.emit(joinEvents.playerJoinedCustomLobby)
        cb({
            status: acknowledgementStatus.success,
            message: `joining lobby: ${lobbyId}`
        })

    } catch (e) {
        console.log(e)
    }
}