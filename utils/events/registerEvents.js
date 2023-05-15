import { socketEvents } from '../constants.js'

import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest 
} from './eventhandlers/friendEvents.js'

import {
    inviteFriendToCustomLobby,
    createCustomGameLobby,
    joinCustomLobby,
    startCustomGame
} from './eventhandlers/customGameEvents.js'

import {
    joinBattleRoyaleQueue,
    leaveBattleRoyalQueue, 
    joinDeathmatchQueue,
    leaveDeathmatchQueue
} from './eventhandlers/gameEvents.js'

import { handleDisconnect } from './eventhandlers/disconnect.js'

const { friendEvents, customGameEvents, gameEvents } = socketEvents

const registerEvents = (socket) => {
    // disconnection
    socket.on('disconnect', handleDisconnect)

    // friend events
    socket.on(friendEvents.sendFriendRequest, sendFriendRequest)
    socket.on(friendEvents.acceptFriendRequest, acceptFriendRequest)
    socket.on(friendEvents.rejectFriendRequest, rejectFriendRequest)

    // custom game events
    socket.on(customGameEvents.createCustomGameLobby, createCustomGameLobby)
    socket.on(customGameEvents.inviteFriendToCustomLobby, inviteFriendToCustomLobby)
    socket.on(customGameEvents.joinCustomLobby, joinCustomLobby)
    socket.on(customGameEvents.startCustomGame, startCustomGame)

    // game events 
    // BR 
    socket.on(gameEvents.battleRoyale.joinBattleRoyaleQueue, joinBattleRoyaleQueue)
    socket.on(gameEvents.battleRoyale.leaveBattleRoyaleQueue, leaveBattleRoyalQueue)

    // Deathmatch
    socket.on(gameEvents.deathmatch.joinDeathmatchQueue, joinDeathmatchQueue)
    socket.on(gameEvents.deathmatch.leaveDeathmatchQueue, leaveDeathmatchQueue)
}

export default registerEvents;