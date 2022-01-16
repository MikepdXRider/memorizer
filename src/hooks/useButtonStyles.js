import React from 'react'
import { useState } from 'react'

export default function useButtonStyles() {
    const [buttonStyles, setButtonStyles] = useState([
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none'
    ])

    function giveHints(arr){
        for(let i=0; i<arr.length; i++){
            setButtonStyles(prevState => {
                const newState = [...prevState];
                newState[arr[i]] = 'animate'
                return newState;
            })
        }
    }

    return {buttonStyles, giveHints}
}
