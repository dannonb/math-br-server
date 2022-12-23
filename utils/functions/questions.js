const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

class Question {
    constructor(expression, answer) {
        this.expression = expression
        this.answer = answer
    }
}

export const additionQuestion = (difficulty) => {
    let first, second, sum

    if (difficulty === 1) {
        first = random(1, 50)
        second = random(1, 50)
    } else if (difficulty === 2) {
        first = random(50, 100)
        second = random(50, 100)
    } else if (difficulty === 3) {
        first = random(100, 999)
        second = random(100, 999)
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
        first = random(1, 45)
        second = random(first + 1, 50)
    } else if (difficulty === 2) {
        first = random(50, 95)
        second = random(first + 1, 100)
    } else if (difficulty === 3) {
        first = random(100, 995)
        second = random(first + 1, 999)
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
        first = random(1, 12)
        second = random(1, 12)
    } else if (difficulty === 2) {
        first = random(10, 100)
        second = 10
    } else if (difficulty === 3) {
        first = random(100, 999)
        second = [10, 100, 1000][random(0, 2)]
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
        base = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][random(0, 9)]
        exponent = 2
    } else if (difficulty === 2) {
        base = random(1, 10)
        exponent = random(2, 4)
    } else if (difficulty === 3) {
        base = random(11, 100)
        exponent = random(3, 5)
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