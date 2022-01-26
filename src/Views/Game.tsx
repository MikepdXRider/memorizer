
//User experience:
    // Lands on home page.
        // Sees blurb about game.
        // Sees button/link to gameboard.
        // Sees dev social media links.
        // Clicks gameboard button/link, is pushed to the gameboard.
        // Clicks dev social media links, is send to correspending link.
    // Lands on game page.
        // ✔ Sees a 'Start round.' button.
        // ✔ Sees a gameboard with 9 buttons.
        // Clicks 'start round.' button.
            // ✔ Round begins.
                // ✔ Game generates an array of correct answers.  
                // ✔ Game disables buttons.
                // ✔ Game shows the user the correct sequence.
                // ✔ Game enables buttons.
                // ✔ Game tracks users clicks.
                    // Per click, if selection is incorrect answer...
                        // Disable everything.
                        // Show fail modal.
                        // Redirect user to home page.
                // ✔ Once user has selected all correct answers...
                    // ✔ Reset game.
                    // ✔ Increase level.
                    // ✔ Display start button.
                    // ✔ Rinse and repeat.
// Small tickets:
    // - Add delay between 'start round' click and actual hint giving. 
    // - When the correct answer array generates the same value twice in a row, it isn't always clear to the view.
    // - Condense state:
        // It feels like I have to reset too many things in the app when a round ends. 
        // Clicks is equivelant to the length of the userGuesses Array. Is this something I can remove?
        // Could the win/loss states be a single state?



import { useEffect, useState } from 'react'
import { createCorrectAnswers, checkAnswer } from '../utils/utils';
import '../App.css';


export default function Game() {
    const [level, setLevel] = useState<number>(3);
    const [clicks, setClicks] = useState<number>(0);
    const [userGuesses, setUserGuesses] = useState<Array<number>>([]);
    const [correctAnswers, setCorrectAnswers] = useState<Array<number>>([]);
    const [buttonStyles, setButtonStyles] = useState(['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none']);
    const [win, setWin] = useState(false);
    const [loss, setLoss] = useState(false);
    const [isGameInPlay, setIsGameInPlay] = useState(false);

    
    useEffect(() => {
        if(isGameInPlay){
            const arr = createCorrectAnswers(level);
            setCorrectAnswers(arr);
        }
    }, [level, isGameInPlay]);


    useEffect(() => {
        if(win){
            setLevel(prevState => prevState + 1);
            setWin(false);
            setIsGameInPlay(false);
            setUserGuesses([]);
            setClicks(0);
        }
        if(loss){
            // actvate loss modal.
        }
    }, [win, loss]);


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
    }, [userGuesses, clicks, correctAnswers]);


    return (
        <main>
            { 
                isGameInPlay 
                ? <p>Good luck!</p>
                : <button onClick={() =>setIsGameInPlay(prevState => !prevState)}>Start round {level}!</button>
            }
            { win && <h1>You won!</h1> }
            { loss && (
                <section className='modal-background'>
                    <div>
                        <h3>You lost!</h3>
                        <p>You're last selection was {userGuesses[clicks - 1]}, the correct number was {correctAnswers[clicks]}</p>
                        <p>You made it to round {level}!</p>
                    </div>
                </section>
            ) }
            <div>
                {
                    buttonStyles.map((button, index) => 
                        <button 
                            key={index}
                            name={`${index}`} 
                            id={`${index}`}
                            value={index} 
                            onClick={handleClick} 
                            disabled={!isGameInPlay || win || loss || clicks === level} 
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
