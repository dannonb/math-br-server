import { randomNumber } from "./helpers"

class Question {
    constructor(expression, answer) {
        this.expression = expression
        this.answer = answer
    }
}

export const additionQuestion = (difficulty) => {
    let first, second, sum

    if (difficulty === 1) {
        first = randomNumber(1, 50)
        second = randomNumber(1, 50)
    } else if (difficulty === 2) {
        first = randomNumber(50, 100)
        second = randomNumber(50, 100)
    } else if (difficulty === 3) {
        first = randomNumber(100, 999)
        second = randomNumber(100, 999)
    }

    sum = first + second

    return new Question(
        `${first} + ${second}`,
        sum
    )
}

export const subtractionQuestion = (difficulty) => {
    let first, second, difference
    
    if (difficulty === 1) {
        first = randomNumber(1, 45)
        second = randomNumber(first + 1, 50)
    } else if (difficulty === 2) {
        first = randomNumber(50, 95)
        second = randomNumber(first + 1, 100)
    } else if (difficulty === 3) {
        first = randomNumber(100, 995)
        second = randomNumber(first + 1, 999)
    }
    
    difference = second - first

    return new Question(
        `${second} - ${first}`,
        difference
    )
}

export const multiplicationQuestion = (difficulty) => {
    let first, second, product
    
    if (difficulty === 1) {
        first = randomNumber(1, 12)
        second = randomNumber(1, 12)
    } else if (difficulty === 2) {
        first = randomNumber(10, 100)
        second = 10
    } else if (difficulty === 3) {
        first = randomNumber(100, 999)
        second = [10, 100, 1000][randomNumber(0, 2)]
    }

    product = first * second

    return new Question(
        `${first} x ${second}`,
        product
    )
}

export const exponentQuestion = (difficulty) => {
    let base, exponent, power
    
    if (difficulty === 1) {
        base = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][randomNumber(0, 9)]
        exponent = 2
    } else if (difficulty === 2) {
        base = randomNumber(1, 10)
        exponent = randomNumber(2, 4)
    } else if (difficulty === 3) {
        base = randomNumber(11, 100)
        exponent = randomNumber(3, 5)
    }

    power = Math.pow(base, exponent)

    return new Question(
        `${base} to the power of ${exponent}`,
        power
    )
}

// console.log('level 1 addition', additionQuestion(1))
// console.log('level 2 addition', additionQuestion(2))
// console.log('level 3 addition', additionQuestion(3))

// console.log('level 1 subtraction', subtractionQuestion(1))
// console.log('level 2 subtraction', subtractionQuestion(2))
// console.log('level 3 subtraction', subtractionQuestion(3))

// console.log('level 1 multiplication', multiplicationQuestion(1))
// console.log('level 2 multiplication', multiplicationQuestion(2))
// console.log('level 3 multiplication', multiplicationQuestion(3))

// console.log('level 1 exponent', exponentQuestion(1))
// console.log('level 2 exponent', exponentQuestion(2))
// console.log('level 3 exponent', exponentQuestion(3))