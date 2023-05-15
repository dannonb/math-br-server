import { 
    additionQuestion, 
    subtractionQuestion, 
    multiplicationQuestion, 
    exponentQuestion 
} from './questions.js'


export const gameTimer = (seconds, onEnd, onEverySecond) => {
    let currentTime = 1
    const interval = setInterval(() => {
        if (onEverySecond) {
            onEverySecond(currentTime)
        }
        currentTime++
        if (currentTime > seconds) {
            clearInterval(interval)
            onEnd()
        }
    }, 1000)
}