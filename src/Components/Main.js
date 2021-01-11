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
        let guess = this.state.guess.toLowerCase()
        let correctPosition = []
        let correctLetter = []
        for(var idx = 0; idx < this.state.length; idx++){
            if(this.state.answer.includes(guess[idx])){
                if(guess[idx] === this.state.answer[idx]){
                    correctPosition.push(idx)
                } else {
                    correctLetter.push(idx)
                }
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
            result: "You Lose"
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