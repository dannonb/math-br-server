import { v4 as uuid4 } from 'uuid'

import { gameModes, rankedOrder, playerStatus, defaultGameSettings } from './constants.js'
import { createPublicMatchGameStateAndLobby, determineRank, startPublicMatch } from './functions/helpers.js'
import { handleStatusChange } from './events/eventhandlers/statusChange.js'

const battleRoyaleQueues = []
const deathMatchQueues = []

class Queue {
    constructor(rank, gamemode) {
        this.id = gamemode + "-" + uuid4()
        this.gamemode = gamemode
        this.rank = rank
        this.players = []
        this.createdAt = Date.now()
    }
    playerNotAlreadyInQueue(playerId) {
        if (typeof playerId !== String) {
            playerId = playerId.toString()
        }
        const position = this.players.findIndex(player => player.playerId === playerId.toString())
        if (position === -1) {
            return true
        } else {
            return false
        };
    }
    async addPlayer(player) {
        const position = this.players.findIndex(p => p.playerId === player._id.toString())
        if (position !== -1) return;
        this.players.push({ playerId: player._id.toString(), joinedAt: Date.now(), mmr: player.stats.mmr })
    }
    removePlayer(playerId) {
        if (typeof playerId !== String) {
            playerId = playerId.toString()
        }
        const position = this.players.findIndex(player => player.playerId === playerId)
        if (position !== -1) {
            this.players.splice(position, 1)
        }
    }
    getPlayers(numberOfPlayers) {
        this.players.sort((a, b) => {
            return a.joinedAt < b.joinedAt
        })
        if (this.players.length < numberOfPlayers) {
            const currentGroup = this.players
            this.players = []
            return currentGroup
        }
        const currentGroup = this.players.slice(0, numberOfPlayers)
        this.players.splice(0, numberOfPlayers - 1)
        return currentGroup
    }
    getHighestRankedPlayers(numberOfPlayers) {
        this.players.sort((a, b) => {
            return b.mmr > a.mmr
        })
        if (numberOfPlayers > this.players.length) {
            const players = this.players
            this.players = []
            return players
        }
        const players = this.players.slice(0, numberOfPlayers)
        this.players.splice(0, numberOfPlayers)
        return players
    }
    getLowestRankedPlayers(numberOfPlayers) {
        this.players.sort((a, b) => {
            return b.mmr < a.mmr
        })
        if (numberOfPlayers > this.players.length) {
            const players = this.players
            this.players = []
            return players
        }
        const players = this.players.slice(0, numberOfPlayers)
        this.players.splice(0, numberOfPlayers)
        return players
    }
}

// class BattleRoyaleQueue extends Queue {
//     getPlayersForBattleRoyale(numberOfPlayers) {
//         this.players.sort((a, b) => {
//             return a.joinedAt < b.joinedAt
//         })
//         console.log(this.players)
//         if (this.players.length < numberOfPlayers) {
//             const currentGroup = this.players
//             this.players = []
//             return currentGroup
//         }
//         const currentGroup = this.players.slice(0, numberOfPlayers)
//         this.players.splice(0, numberOfPlayers - 1)
//         return currentGroup
//     }
// }

// class DeathMatchQueue extends Queue {
//     getPlayersForDeathMatch() {
//         this.players.sort((a, b) => {
//             return a.joinedAt < b.joinedAt
//         })
//         if (this.players.length > 2) {
//             const currentGroup = this.players.slice(0, 2)
//             this.players.splice(0, 2)
//             return currentGroup
//         }
//         const currentGroup = this.players
//         this.players = []
//         return currentGroup
//     }
// }


export const handleJoinMatchmaking = async function (player, gamemode) {
    const socket = this
    const playerRank = determineRank(player.stats.mmr)
    let existingQueue
    switch (gamemode) {
        case gameModes.BATTLEROYALE:
            const existingBRQueue = battleRoyaleQueues.find((q) => q.rank === playerRank)
            if (existingBRQueue) {
                existingBRQueue.addPlayer(player)
                player.currentQueueId = existingBRQueue.id
                existingQueue = existingBRQueue
            } else {
                const newQueue = new Queue(playerRank, gamemode)
                newQueue.addPlayer(player)
                player.currentQueueId = newQueue.id
                battleRoyaleQueues.push(newQueue)
            }
        case gameModes.DEATHMATCH:
            const existingDMQueue = deathMatchQueues.find((q) => q.rank === playerRank)
            if (existingDMQueue) {
                existingDMQueue.addPlayer(player)
                player.currentQueueId = existingDMQueue.id
                existingQueue = existingDMQueue
            } else {
                const newQueue = new Queue(playerRank, gamemode)
                newQueue.addPlayer(player)
                player.currentQueueId = newQueue.id
                deathMatchQueues.push(newQueue)
            }
            console.log(deathMatchQueues)
    }
    player.status = playerStatus.MATCHMAKING
    await player.save()
    handleStatusChange(player, socket)
    if (existingQueue) {
        checkForPossibleGameAfterPlayerJoinsQueue(existingQueue)
    }
}

export const handleLeaveMatchmaking = async function (player, gamemode) {
    const socket = this
    const playerRank = determineRank(player.stats.mmr)
    switch (gamemode) {
        case gameModes.BATTLEROYALE:
            let currentBRQueue = battleRoyaleQueues.find(q => q.rank === playerRank)
            if (!currentBRQueue) return;
            currentBRQueue.removePlayer(player._id)
        case gameModes.DEATHMATCH:
            let currentDMQueue = deathMatchQueues.find(q => q.rank === playerRank)
            if (!currentDMQueue) return;
            currentDMQueue.removePlayer(player._id)
    }
    player.status = playerStatus.IDLE
    player.currentQueueId = ''
    await player.save()
    handleStatusChange(player, socket)
}

export const getPlayersFromQueue = (queue, numberOfPlayers) => {
    console.log(queue.gamemode)
    switch (queue.gamemode) {
        case gameModes.BATTLEROYALE:
            const brPlayers = []
            brPlayers.concat(queue.getPlayers(numberOfPlayers))
            if (brPlayers.length < numberOfPlayers) {

                const currentRankIndex = rankedOrder.indexOf(queue.rank)

                if (currentRankIndex === -1) return

                const nextRank = rankedOrder[currentRankIndex + 1]
                const nextRankQueue = battleRoyaleQueues.find(q => q.rank = nextRank)

                if (nextRankQueue) {
                    const playersFromNextRank = nextRankQueue.getLowestRankedPlayers(numberOfPlayers - brPlayers.length)
                    brPlayers.concat(playersFromNextRank)
                }
                if (brPlayers.length < numberOfPlayers) {
                    const lastRank = rankedOrder[currentRankIndex - 1]
                    const lastRankQueue = battleRoyaleQueues.find(q => q.rank = lastRank)

                    if (lastRankQueue) {
                        const playersFromLastRank = lastRankQueue.getHighestRankedPlayers(numberOfPlayers - brPlayers.length)
                        brPlayers.concat(playersFromLastRank)
                    }
                }
            }
            return brPlayers
        case gameModes.DEATHMATCH:
            let dmPlayers = []
            dmPlayers = queue.getPlayers(numberOfPlayers)
            if (dmPlayers.length < numberOfPlayers) {
                const currentRankIndex = rankedOrder.indexOf(queue.rank)
                if (currentRankIndex === -1) return
                const nextRank = rankedOrder[currentRankIndex + 1]
                const nextRankQueue = deathMatchQueues.find(q => q.rank = nextRank)

                if (nextRankQueue) {
                    const playersFromNextRank = nextRankQueue.getLowestRankedPlayers(numberOfPlayers - dmPlayers.length)
                    dmPlayers.concat(playersFromNextRank)
                }
                if (dmPlayers.length < numberOfPlayers) {
                    const lastRank = rankedOrder[currentRankIndex - 1]
                    const lastRankQueue = deathMatchQueues.find(q => q.rank = lastRank)

                    if (lastRankQueue) {
                        const playersFromLastRank = lastRankQueue.getHighestRankedPlayers(numberOfPlayers - dmPlayers.length)
                        dmPlayers.concat(playersFromLastRank)
                    }

                }
            }
            return dmPlayers
    }
}

export const checkForPossibleGameAfterPlayerJoinsQueue = async (queue) => {
    const amountOfPlayersNeededToStart = queue.gamemode === gameModes.BATTLEROYALE ? defaultGameSettings.battleRoyale.maxPlayers : defaultGameSettings.deathMatch.maxPlayers
    try {
        if (queue.players.length >= amountOfPlayersNeededToStart) {
            console.log("creating public game lobby")
            const { gameState, game } = await createPublicMatchGameStateAndLobby(queue)
        
            console.log(gameState, game)
    
            if (gameState && game) {
                console.log("STARTING PUB MATCH")
                startPublicMatch(gameState, game)
            }
        }
    } catch (e) {
        console.log(e)
    }
}

export const checkForPossibleGame = (gamemode) => {

}

export const removePlayersFromQueue = () => {

}

export const removeDisconnectedPlayerFromQueue = (queueId, playerId) => {
    let queue
    const mode = queueId.split('-')[0]
    if (mode === gameModes.BATTLEROYALE) {
        queue = battleRoyaleQueues.find((q) => {
            return q.id === queueId
        })
    } else if (mode === gameModes.DEATHMATCH) {
        queue = deathMatchQueues.find((q) => {
            return q.id === queueId
        })
    }
    queue.removePlayer(playerId.toString())
}




