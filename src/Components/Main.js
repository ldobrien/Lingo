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
        result: ""
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
            this.setState({
                answer: item,
                guesses: [],
                guess: "",
                length: 5,
                attempts: 5,
                result: ""
            })
          });
    }

    componentDidMount(){
        this.getData()
    }

    addGuess = (e) => {
        e.preventDefault()
        let answerAlt = this.state.answer
        let guess = this.state.guess.toLowerCase()
        let guessAlt = guess
        let correctPosition = []
        let correctLetter = []

        for(var idx = 0; idx < this.state.length; idx++){
            if(this.state.answer[idx] === guess[idx]){
                correctPosition.push(idx)
                guessAlt = guessAlt.substr(0, idx) + "-" + guessAlt.substr(idx + 1)
                answerAlt = answerAlt.substr(0, idx) + "-" + answerAlt.substr(idx + 1)
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
            guess: ""
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
        if(this.state.result !== ""){
            replay = <button onClick={this.playAgain}>Play Again</button>
        } else {
            form = (
                <form className="center"  onSubmit={this.addGuess}>
                        <label>
                            Guess:
                            <input type="text" guess="guess" onChange={this.handleChange} minLength={this.state.length} maxLength={this.state.length}/>
                        </label>
                        <input type="submit" value="Submit"/>
                </form>
            )
        }
        return(
            <div>
                <p className="inputText">{this.state.answer[0]}_ _ _ _</p>
                
                <Board answer={this.state.answer} guesses={this.state.guesses}/>
                {form}
                <p className={this.state.result === "You Win!" ? "green-text" : "red-text"}>{this.state.result}</p>
                {replay}
            </div>
        )
    }
}

export default Main