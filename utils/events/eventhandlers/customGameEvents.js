import {
    socketEvents,
    acknowledgementStatus
} from '../../constants.js'

import Player from '../../../models/player.js'

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

export const joinCustomGame = async function ({ playerId, gameId }, cb) {
    const socket = this
    try {

    } catch (e) {
        console.log(e)
    }
}

export const startCustomGame = async function( ) {

}

export const createCustomGameLobby = async function ({ ownerId, lobbyId, rules }, cb) {
    const socket = this
    try {
        
    } catch (e) {
        console.log(e)
    }
}