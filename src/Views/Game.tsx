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
// If game is current giving hints, disable buttons.
// 
// 

import { useEffect, useState } from 'react'
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
        const { value }:{value: string} = e.target;
        const valueNum = Number(value);
        // ✔ Solved: State is behind within the scope of this fn. 
        // The setter function in a hook queues an update, but doesn't not immediately update it. We can resolve this by keeping setter function calls here, then move the rest of the dependent functionality into a useEffect hook. 
        // https://stackoverflow.com/questions/28773839/react-form-onchange-setstate-one-step-behind
        setUserGuesses(prevState => [...prevState, valueNum]);
        setClicks(prevState => prevState + 1);
    }
    
    // ❗ Automatically trigger a game fail/win because there will be no userGuesses to compare to the correctAnswers when it is generated.
    useEffect(() => {
        console.log('userArr: ' + userGuesses.length, 'correctArr: ' + correctAnswers.length, 'userClicks: ' + clicks);
        
        // 💂‍♀️
        if (!userGuesses.length) return; 

        const isCorrectGuess = checkAnswer(userGuesses, correctAnswers, clicks - 1);
        
        if (!isCorrectGuess) setLoss(true);
        if (userGuesses.length === correctAnswers.length) setWin(true);
        
    }, [userGuesses, clicks, correctAnswers])


    return (
        <main>
            {
                win && <h1>You won!</h1>
            }
            
            {
                loss && <h1>You Lose!</h1>
            }
            
            <div>
                {/* 🌟 Could this be dynamically rendered? */}

                {
                    buttonStyles.map((button, index) => 
                        <button 
                            key={index}
                            name={`${index}`} 
                            id={`${index}`}
                            value={index} 
                            onClick={handleClick} 
                            disabled={win || loss || clicks === level} 
                            className={buttonStyles[index]}
                        >
                            {index + 1}
                        </button>
                    )
                }
                
            </div>
        </main>    
    )
}
