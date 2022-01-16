// Game Logic
    // Game starts at level one, increases until user fails.
    // Game asks user if they are prepared to start.
        // On yes click, Game randomly generates an array of random numbers from 0-8, array length is defined by parameter.
        // Game uses this new array to highlight elements corresponding to the numbers in the array, in order of the array, and highlights are seperated by a second.
        // Game enables the buttons.
        // User has one attempt(stretch, offer more attempts as challenge increases).
        // If user fails, start the game over. If user succeeds, beging next level.

// MVP FUNCTIONALISTY:
// ✔ Game dynamically generates a random array of correct answers.
// ✔ Game highlights the correct buttons for user.
// ✔ Game tracks users guesses.
// ✔ Game determines if guess(es) is(are) correct.
// ✔ Game tracks the number of clicks/guesses the user has made.
// Game prompts user if win/loss round.
// Game resets if player losses.
// Game has start button that begins the game/starts the round.
// 
// 
// 

import React, { useEffect, useState } from 'react'
import { createCorrectAnswers, checkAnswer } from '../utils/utils';
import '../App.css';


export default function Game() {
    const [level, setLevel] = useState<number>(3);
    const [clicks, setClicks] = useState<number>(0);
    const [userGuesses, setUserGuesses] = useState<Array<number>>([]);
    const [correctAnswers, setCorrectAnswers] = useState<Array<number>>([]);
    const [buttonStyles, setButtonStyles] = useState(['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'])
    const [win, setWin] = useState(false);
    const [loss, setLoss] = useState(false);
    
    
    useEffect(() => {
        const arr = createCorrectAnswers(level);
        setCorrectAnswers(arr);
    }, [level])

    useEffect(() => {
        // STAR THIS!
        // Setting: Working on a side project for fun after being inspired by another simple game that is very fun; Wordle. 
        // Task: High-Level - Highlight the correct buttons in the correct sequence for the user before they attempt to replicate it. Tech - Looping through an array, momentarily updating a piece of state per array item using a setTimeOut/setInterval. 
        // Action: I wrote a classic for loop and implemented the setInterval. When I checked state for the expected actions, the loop was ignoring the timeout/interval. After 15 minutes of moving code around and attempting different known approaches, I took to stackOverflow. There I found a recursive approach using an index accumulator. I replicated this approach within my own code, and improved it slightly by adding the accumulator as an optional parameter in the recursive function.
        // Result: The buttons highlighting began behaving as expected. The project was able to move forward without losing too much time on a problem. I got to learn a new approach and limitation/boundary of JS, and practice recrusive functions. 

        // Using a forloop with a setTimeout/Interval was not working. Each loop executed without regard for the timeout/interval. This solution was found here:
        // https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
        function giveHints(arr: any, i = 0){
            
            setButtonStyles(prevState => {
                const newState = [...prevState];
                newState[arr[i]] = 'focus'
                return newState;
            });
            
            setTimeout(() => {
                
                setButtonStyles(prevState => {
                    const newState = [...prevState];
                    newState[arr[i]] = 'none'
                    return newState; 
                });
        
                i < arr.length 
                ? giveHints(correctAnswers, i+1)
                : i = 0;
            }, 1000);
        }

        giveHints(correctAnswers);
    }, [correctAnswers]);



    function handleClick(e:any){
        const { value }:{value: number} = e.target;
        // ❗ State is behind within the scope of this fn. 
        setUserGuesses(prevState => [...prevState, value]);
        setClicks(prevState => prevState + 1);
        const isCorrectGuess = checkAnswer(userGuesses, correctAnswers, clicks - 1);

        // ❗ Not working. Need to resolve state issue above before continuing. 
        // if (!isCorrectGuess) setLoss(true);
        // console.log(userGuesses.length, correctAnswers.length);
        // if (userGuesses.length === correctAnswers.length) console.log('Nice Job, you beat this level!');
    }




    return (
        <div>
            {/* Could this be dynamically rendered? */}
            <button name='0' id='0' value={0} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[0]}>1</button>
            <button name='1' id='1' value={1} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[1]}>2</button>
            <button name='2' id='2' value={2} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[2]}>3</button>
            <button name='3' id='3' value={3} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[3]}>4</button>
            <button name='4' id='4' value={4} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[4]}>5</button>
            <button name='5' id='5' value={5} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[5]}>6</button>
            <button name='6' id='6' value={6} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[6]}>7</button>
            <button name='7' id='7' value={7} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[7]}>8</button>
            <button name='8' id='8' value={8} onClick={handleClick} disabled={win || loss ||clicks > correctAnswers.length - 1} className={buttonStyles[8]}>9</button>
        </div>
    )
}
