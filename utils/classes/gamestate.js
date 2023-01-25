import { v4 as uuid4 } from 'uuid'

import {
    difficulties,
    gameModes,
    gameStatus,
    gameTypes
} from '../constants.js';

class GameState {
    constructor(
        room,
        gameMode = gameModes.BATTLEROYALE,
        isPractice = false,
        useBots = false,
        rounds,
        elimiatePlayers,
        difficulty = difficulties.MEDIUM,
        type = gameTypes.CLASSIC,
        creator = "none",
        aiController = null
    ) {
        this.game_id = uuid4();
        this.room = room
        this.mode = gameMode
        this.isPractice = isPractice
        this.useBots = useBots
        this.players = []
        this.playerCount = this.players.length
        this.rounds = rounds
        this.eliminatePlayers = gameMode === gameModes.DEATHMATCH ? false : elimiatePlayers // keeps all players for entire game if true
        this.type = type
        this.difficulty = difficulty
        this.status = gameStatus.INLOBBY
        this.currentRound = 1
        this.creator = creator
        this.aiController = aiController
    }
    serialize() {
        return JSON.stringify({
            game_id: this.game_id,
            room: this.room,
            mode: this.mode,
            isPractice: this.isPractice,
            players: this.players.map(player => {
                return {
                    username: player.username,
                    room: player.room,
                    socketId: player.socket.id,
                    isBot: player.isBot,
                    score: player.score,
                    guesses: player.guesses,
                    alive: player.alive,
                    team: player.team,
                    inGame: player.inGame,
                    currentAnswer: player.currentAnswer,
                    streak: player.streak
                }
            }),
            playerCount: this.playerCount,
            rounds: this.rounds,
            elimnatePlayers: this.eliminatePlayers,
            type: this.type,
            difficulty: this.difficulty,
            status: this.status,
            currentRound: this.currentRound,
            creator: this.creator,
            bots: this.aiController.getBots()
        })
    }
    addPlayer(playerState) {
        const index = this.players.findIndex(player => player.id === playerState.id)
        if (index !== -1) return;
        if (this.mode === gameModes.DEATHMATCH && this.players.length >= 2) return;
        this.players.push(playerState)
    }
    removePlayer(playerState) {
        this.players.splice(playerState)
    }
    increaseRound() {
        if (this.currentRound < this.rounds) {
            this.currentRound++
        }
    }
    calculateScores() {
        console.log('calculating scores')
        
    }
    eliminatePlayers() {
        console.log('eliminating players')
    }
    rankPlayers() {
        console.log('ranking players')
    }

}

export default GameState