import React, {Component} from 'react'
import Board from './Board'
import './Board.css'

class Main extends Component {
    state ={
        answer: "",
        guesses: [],
        guess: "",
        length: 5,
        attempts: 5,
        result: "",
        topString: ["_ ", "_ ", "_ ", "_ ", "_"],
    }

    getData = () => {
        fetch('data.json'
        ,{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          })
          .then(res => {
            return res.json();
          })
          .then(json => {
            var item = json[Math.floor(Math.random() * json.length)];
            let topString = [item[0], "_ ", "_ ", "_ ", "_"]
            this.setState({
                answer: item,
                guesses: [],
                guess: "",
                length: 5,
                attempts: 5,
                result: "",
                topString
            })
          });
    }

    componentDidMount(){
        this.getData()
    }

    addGuess = (e) => {
        // TODO: Need to send the guess to the back end so I don't need to send the json data to the front for comparison
        e.preventDefault()
        let answerAlt = this.state.answer
        let guess = this.state.guess.toLowerCase()
        var topString = [...this.state.topString]
        let guessAlt = guess
        let correctPosition = []
        let correctLetter = []

        for(var idx = 0; idx < this.state.length; idx++){
            if(this.state.answer[idx] === guess[idx]){
                correctPosition.push(idx)
                guessAlt = guessAlt.substr(0, idx) + "-" + guessAlt.substr(idx + 1)
                answerAlt = answerAlt.substr(0, idx) + "-" + answerAlt.substr(idx + 1)
                topString[idx] =  guess[idx] + " "
            }
        }
        
        for(var idx = 0; idx < this.state.length; idx++){
            if(answerAlt.includes(guessAlt[idx]) && guessAlt[idx] !== "-"){
                correctLetter.push(idx)
                let answerIdx = answerAlt.indexOf(guessAlt[idx])
                guessAlt = guessAlt.substr(0, idx) + "-" + guessAlt.substr(idx + 1)
                answerAlt = answerAlt.substr(0, answerIdx) + "-" + answerAlt.substr(answerIdx + 1)
            }
        }
        let guessObj = {
            guess,
            correctPosition,
            correctLetter
        }
        let newGuesses = [...this.state.guesses, guessObj]
        this.setState({
            guesses: newGuesses,
            guess: "",
            topString
        }, () => {
            if(this.state.length === correctPosition.length){
                this.handleWin()
            } else if (this.state.attempts === this.state.guesses.length){
                this.handleLoss()
            }
        })
    }

    handleWin = () => {
        this.setState({
            ...this.state,
            result: "You Win!"
        })
    }

    handleLoss = () => {
        this.setState({
            ...this.state,
            result: "You Lose, the word was " + this.state.answer
        })
    }

    handleChange = (e) => {
        this.setState({
            guess: e.target.value
        })
    }

    playAgain = () => {
        this.getData()
    }

    render() {
        let replay = <div></div>
        let form = <div></div>
        let topStringArr = this.state.topString
        let topString = <p className="inputText">{topStringArr}</p>

        if(this.state.result !== ""){
            replay = <button onClick={this.playAgain}>Play Again</button>
        } else {
            form = (
                <form className="center"  onSubmit={this.addGuess}>
                        <label>
                            Guess:
                            <input type="text" guess="guess" value={this.state.guess} onChange={this.handleChange} minLength={this.state.length} maxLength={this.state.length}/>
                        </label>
                        <input type="submit" value="Submit"/>
                </form>
            )
        }
        return(
            <div>
                <div className="left">
                    <p className="bold">How To Play </p>
                    <p>You have 5 attempts to guess the word</p>
                    <p>Every time you enter a guess, any correct letters will be highlighted in yellow </p>
                    <p>A yellow circle means that the letter belongs in the word, but it is not in the correct spot </p>
                    <p>A yellow square means that the letter is correct and is in the correct spot </p>
                    <p>If you have guessed the correct word, the entire word will be highlighted in green </p>
                </div>
                <div className="boardDiv">
                    {topString}
                    <Board answer={this.state.answer} guesses={this.state.guesses}/>
                    {form}
                    <p className={this.state.result === "You Win!" ? "green-text" : "red-text"}>{this.state.result}</p>
                    {replay}
                </div>
            </div>
        )
    }
}

export default Main