export function generateRanNum() {
    return Math.round(Math.random() * 8);
}

export function createCorrectAnswers(count: number) {
    let acc = [];

    for(let i = 0; i < count; i++){
        acc.push(generateRanNum());
    }

    return acc;
}


export function checkAnswer(userGuesses: Array<number>, correctAnswers: Array<number>, index: number ){
    if (userGuesses[index] === correctAnswers[index]) return true;
    return false;
}
