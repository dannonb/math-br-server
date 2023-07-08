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
    RANDOM: 'RANDOM',
    TRIVIA: 'TRIVIA'
}

export const triviaCategories = {
    GeneralKnowledge: 9,
    Books: 10,
    Film: 11,
    Music: 12
}

export const difficulties = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
}

export const defaultGameSettings = {
    battleRoyale: {
        maxPlayers: 100,
        rules: {
            isPractice: false,
            useBots: false,
            rounds: 3,
            eliminatePlayers: true,
            difficulty: difficulties.MEDIUM,
            type: gameTypes.CLASSIC
        }
    },
    deathMatch: {
        maxPlayers: 2,
        rules: {
            isPractice: false,
            useBots: false,
            rounds: 3,
            eliminatePlayers: false,
            difficulty: difficulties.MEDIUM,
            type: gameTypes.CLASSIC
        }
    }
}

export const ai = {
    
}

export const times = {
    timeToRemoveGamesLeftInLobby: 5 * 60 * 60 * 1000
}

export const gameStatus = {
    INLOBBY: 'INLOBBY',
    READY: 'READY',
    INPROGRESS: 'INPROGRESS',
    FINISHED: 'FINISHED'
}

export const playerStatus = {
    IDLE: 'IDLE',
    OFFLINE: 'OFFLINE',
    MATCHMAKING: 'MATCHMAKING',
    INGAME: 'INGAME'
}

export const ranks = {
    UNRANKED: 'UNRANKED',
    BRONZE: 'BRONZE',
    SILVER: 'SILVER',
    GOLD: 'GOLD',
    PLATINUM: 'PLATINUM',
    DIAMOND: 'DIAMOND',
    CHAMPION: 'CHAMPION',
    GENIUS: 'GENIUS'
}

export const rankedOrder = [
    ranks.UNRANKED, 
    ranks.BRONZE, 
    ranks.SILVER, 
    ranks.GOLD,
    ranks.PLATINUM,
    ranks.DIAMOND,
    ranks.CHAMPION,
    ranks.GENIUS
]

export const socketEvents = {
    connectEvents: {
        registerSocketId: 'registerSocketId',
        rejoinGameAfterDisconnect: 'rejoinGameAfterDisconnect',
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
        startCustomGame: 'startCustomGame',
        inviteFriendToCustomLobby: 'inviteFriendToCustomLobby',
        joinCustomLobby: 'joinCustomLobby',
        createCustomGameLobby: 'createCustomGameLobby',
        creatorStartedCustomGame: 'creatorStartedCustomGame'
    },
    gameEvents: {
        eliminatedFromMatch: 'eliminatedFromMatch',
        joinMatch: 'joinMatch',
        startMatch: 'startMatch',
        leaveMatch: 'leaveMatch',
        submitAnswer: 'submitAnswer',
        battleRoyale: {
            joinBattleRoyaleQueue: 'joinBattleRoyaleQueue',
            leaveBattleRoyaleQueue: 'leaveBattleRoyaleQueue'
        },
        deathmatch: {
            joinDeathmatchQueue: 'joinDeathmatchQueue',
            leaveDeathmatchQueue: 'leaveDeathmatchQueue'
        }
    },
    statusEvents: {
        updateStatus: 'updateStatus'
    }
}

export const acknowledgementStatus = {
    error: 'error',
    success: 'success'
}