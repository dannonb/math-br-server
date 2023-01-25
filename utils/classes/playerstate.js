import { v4 as uuid4 } from 'uuid'

class PlayerState {
    constructor(room, username, socket, isBot) {
        this.playerStateId = uuid4()
        this.username = username 
        this.room = room
        this.socket = socket
        this.isBot = isBot
        this.score = 0
        this.guesses = 0
        this.alive = true
        this.team = null
        this.inGame = true
        this.currentAnswer = 0
        this.streak = 0
    }
    setCurrentAnswer(answer) {
        this.currentAnswer = answer
    }
    checkAnswer(answer) {
        if (answer === this.currentAnswer) {
            this.streak++
            return true
        } 
        this.streak = 0
        return false
    }
    increaseGuesses() {
        this.guesses++
    }
    resetStreak() {
        this.streak = 0
    }
    increaseScore(amount) {
        this.score += amount
    }
    eliminate(placement) {
        this.alive = false
        this.socket.emit('eliminated', { placement, guesses: this.guesses, score: this.score })
    }
    leaveGame() {
        this.inGame = false
    }
}

export default PlayerState