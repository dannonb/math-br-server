import Player from "../../../models/player.js"
import {
    acknowledgementStatus,
    gameModes,
    socketEvents
} from "../../constants.js"
import {
    handleJoinMatchmaking,
    handleLeaveMatchmaking
} from "../../matchmaking.js"

export const joinBattleRoyaleQueue = async function ({ playerId }, cb) {
    const player = await Player.findById(playerId).populate('stats')
    if (!player) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'An unexpected error occured'
        })
    }
    handleJoinMatchmaking(player, gameModes.BATTLEROYALE)
    cb({
        status: acknowledgementStatus.success,
        message: `Started Matchmaking`
    })
}

export const leaveBattleRoyalQueue = async function ({ playerId }, cb) {
    const player = await Player.findById(playerId).populate('stats')
    if (!player) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'An unexpected error occured'
        })
    }
    handleLeaveMatchmaking(player, gameModes.BATTLEROYALE)
    cb({
        status: acknowledgementStatus.success,
        message: `Canceled Matchmaking`
    })
}

export const joinDeathmatchQueue = async function ({ playerId }, cb) {
    try {
        const player = await Player.findById(playerId).populate('stats')
        if (!player) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'An unexpected error occured'
            })
        }
        handleJoinMatchmaking(player, gameModes.DEATHMATCH)
        cb({
            status: acknowledgementStatus.success,
            message: `Started Matchmaking`
        })
    } catch (e) {
        console.log(e)
    }
}

export const leaveDeathmatchQueue = async function ({ playerId }, cb) {
    try {
        const player = await Player.findById(playerId).populate('stats')
        if (!player) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'An unexpected error occured'
            })
        }
        handleLeaveMatchmaking(player, gameModes.DEATHMATCH)
        cb({
            status: acknowledgementStatus.success,
            message: `Canceled Matchmaking`
        })
    } catch (e) {
        console.log(e)
    }
}