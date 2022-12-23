import { v4 as uuid4 } from 'uuid'

import { 
    difficulties, 
    gameModes, 
    gameTypes 
} from '../constants.js';

class GameState {
    constructor(room, mode, playerStates, rounds, difficulty, type, creator) {
        this.game_id = uuid4();
        this.room = room
        this.mode = mode
        this.players = playerStates;
        this.playerCount = this.players.length;
        this.rounds = rounds
        this.type = type || gameTypes.CLASSIC
        this.difficulty = difficulty || difficulties.MEDIUM;
        this.status = 0
        this.currentRound = 1;
        this.creator = creator || "none";
    }
    addPlayer(playerState) {
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
        
    }
    rankPlayers() {
        console.log('ranking players')
    }
    
}

export default GameState