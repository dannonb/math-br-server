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
        rounds,
        difficulty = difficulties.MEDIUM,
        type = gameTypes.CLASSIC,
        creator = "none"
    ) {
        this.game_id = uuid4();
        this.room = room
        this.mode = gameMode
        this.players = []
        this.playerCount = this.players.length;
        this.rounds = rounds
        this.type = type
        this.difficulty = difficulty
        this.status = gameStatus.INLOBBY
        this.currentRound = 1;
        this.creator = creator;
    }
    serialize() {
        return JSON.stringify({
            game_id: this.game_id,
            room: this.room,
            mode: this.mode,
            players: this.players.map(player => {
                return {
                    username: player.username,
                    room: player.room,
                    socketId: player.socket.id,
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
            type: this.type,
            difficulty: this.difficulty,
            status: this.status,
            currentRound: this.currentRound,
            creator: this.creator
        })
    }
    addPlayer(playerState) {
        const index = this.players.findIndex(player => player.id === playerState.id)
        if (index !== -1) return;
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