export const gameModes = {
    DEATHMATCH: 'DEATHMATCH',
    BATTLEROYALE: 'BATTLEROYALE'
}

export const gameTypes = {
    CLASSIC: 'CLASSIC',
    ADDITION: 'ADDITION',
    SUBTRACTION: 'SUBTRACTION',
    MULTIPLICATION: 'MULTIPLICATON',
    DIVISION: 'DIVISION',
    RANDOM: 'RANDOM'
}

export const difficulties = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
}

export const ai = {
    
}

export const gameStatus = {
    INLOBBY: 'INLOBBY',
    INPROGRESS: 'INPROGRESS',
    FINISHED: 'FINISHED'
}

export const socketEvents = {
    connectEvents: {
        registerSocketId: 'registerSocketId'
    },
    friendEvents: {
        sendFriendRequest: 'sendFriendRequest',
        recieveFriendRequest: 'recieveFriendRequest',
        acceptFriendRequest: 'acceptFriendRequest',
        rejectFriendRequest: 'rejectFriendRequest',
        friendRequestAccepted: 'friendRequestAccepted',
        friendRequestRejected: 'friendRequestRejected'
    },
    joinEvents: {
        inviteFriendToCustomLobby: 'inviteFriendToCustomLobby',
        joinCustomLobby: 'joinCustomLobby',
        joinCustomGame: 'joinCustomGame',
        startCustomGame: 'startCustomGame', 
        joinBattleRoyaleQueue: 'joinBattleRoyaleQueue',
        joinDeathmatchQueue: 'joinDeathmatchQueue',
        joinBattleRoyaleLobby: 'joinBattleRoyaleLobby',
        joinDeathmatchLobby: 'joinDeathmatchLobby',
        joinBattleRoyaleGame: 'joinBattleRoyaleGame',
        joinDeathmatchGame: 'joinDeathmatchGame',
        playerJoinedCustomLobby: 'playerJoinedCustomLobby',
        playerJoinedBattleRoyaleLobby: 'playerJoinedBattleRoyaleLobby',
        playerJoinedDeathmatchLobby: 'playerJoinedDeathmatchLobby',
    },
    customGameEvents: {
        startCustomGame: 'startCustomGame'
    },
    gameEvents: {
        eliminatedFromMatch: 'eliminatedFromMatch',
        leaveMatch: 'leaveMatch',
        submitAnswer: 'submitAnswer'
    }

}

export const acknowledgementStatus = {
    error: 'error',
    success: 'success'
}