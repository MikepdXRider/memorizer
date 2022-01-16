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


export function checkAnswer(userGuess: Array<number>, correctAnswers: Array<number>, clicks: number ){
    if (userGuess[clicks] === correctAnswers[clicks]) return true;
    return false;
}
