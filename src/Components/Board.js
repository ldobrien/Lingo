import React, {Component} from 'react'
import {Row, Col} from 'react-materialize'
import './Board.css'

class Board extends Component {
    state ={
        answer: this.props.answer ? this.props.answer : 5,
        length: this.props.answer.length ? this.props.answer.length : 5,
        height: 5,
        guesses: this.props.guesses
    }

    createBoard = () => {
        let board = []
        for(var row = 0; row < this.state.height; row++){
            let rowArr = []
            let rowGuess = this.state.guesses[row]
            for(var col = 0; col < this.state.length; col++){
                if(rowGuess){
                    let correctLetter = rowGuess.correctLetter.includes(col);
                    let correctPosition = rowGuess.correctPosition.includes(col)
                    let classname = correctPosition ? "greenSquare" : correctLetter ? "yellowCircle" : "white"
                    classname = classname + " cell"
                    rowArr.push(<Col className={classname} key={rowArr.length}>
                        <p className="p">{rowGuess.guess[col]}</p>
                        </Col>)
                } else {
                    rowArr.push(<Col className="cell" key={rowArr.length}><p className="white-text">-</p></Col>)
                }
                
            }
            board.push(<Row className="row">{rowArr}</Row>)
        }
        return board
    }

    componentDidUpdate(){
        if(this.state.guesses !== this.props.guesses){
            this.setState({
                ...this.state,
                guesses: this.props.guesses
            })
        }
    }

    render() {
        let board = this.createBoard()
        return(
            <div className="center">{board}</div>
        )
    }
}

export default Board