import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import logo from './logo.svg';
import './App.css';
import { Draw } from './Draw';
function App() {
  const deckId = useRef()

  const [newDeck, setNewDeck] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [click, setClick] = useState(null);
  // const [cardsRemaining, setCardsRemaining] = useState()
  const [buttonText, setButtonText] = useState('draw')
  const interval = useRef()

  const onButtonClick = () => {
    if (!deckId.current) {
      return
    }
    // check if timer is stopped
    const isStopped = interval.current === undefined
    if (isStopped) {
      // start drawing cards
      interval.current = setInterval(() => {
        const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`
        // make the request
        axios.get(url).then((res) => {
          if (res.data.remaining <= 0) {
            // finish the game
            setIsGameOver(true);
            setButtonText('game is over')
            clearInterval(interval.current)
            alert("GAME OVER")
            return
          }
          // add new card to the deck
          const newCard = res.data.cards[0];
          setNewDeck(prev => [...prev, newCard]);
        })
      }, 100);
      setButtonText('stop drawing')
    } else {
      // stop the interval
      clearInterval(interval.current)
      // reset the interval ref
      interval.current = undefined
      setButtonText('start drawing')
    }

  }
  useEffect(() => {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then((res) => {
        deckId.current = (res.data.deck_id);
      })
  }, []);

  // const draw = () => {
  //   if (!deckId.current) return

  //   interval.current = setInterval(() => {
  //     const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`
  //     axios.get(url).then((res) => {
  //       setCardsRemaining(res.data.remaining)
  //       if (res.data.remaining <= 0) {
  //         setIsGameOver(true);
  //         console.log('interval', interval)
  //         clearInterval(interval)
  //         alert("GAME OVER")
  //         return
  //       }
  //       const newCard = res.data.cards[0];
  //       setNewDeck(prev => [...prev, newCard]);
  //     })
  //   }, 100);
  // };

  // useEffect(() => {
  //   // draw();
  //   // return () => { clearInterval(draw())} 
  //   console.log('deck id', deckId.current)
  // }, [deckId.current])

  return (
    <div className="App">
      {console.log("how many times will this render")}
      {!isGameOver ? <h2> START </h2> : <h2>game Over</h2>}

      <button onClick={onButtonClick}> {buttonText} </button>
      {newDeck.map((card, i) => {
        return (
          <p>
            {card.code} - {i}
          </p>
        )
      })}
    </div>
  );
}

export default App;
