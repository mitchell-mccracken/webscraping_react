import {Component} from 'react'
import '../App.css'
import '../my.css';

let baseURL;

baseURL = 'http://localhost:3003'
console.log('current base URL: ' , baseURL)

class Games extends Component{
    constructor(props){
        super(props)
        this.state = {
            myTest: 'my test', 
            displayDetails: false,
            targetId: '',
            link: '',
        }

        this.buttonClick = this.buttonClick.bind(this)
    }

    // functions
   async buttonClick(event){
              
        let eventID = event.target.id*1     //this converts string to number
        for (let i = 0; i < this.props.games.length; i++) {
            let game = this.props.games[i];
            if(game.id === eventID){
                // this.setState({
                //     link: game.mylink
                // })
                this.props.hideGames(game.mylink)
                this.props.chooseGame(game.mylink)
                this.props.getGameDate(game.dateTime)
            }
        }
       
        this.setState({
            myTest: 'button clicked',
            targetId: event.target.id,
            displayDetails: true,
        })
        
        // await this.props.hideGames(this.props.games[0])
    }

    render(){
        return(
            <div>
                <h2> {this.props.displayType} Games</h2>
                <div>
                    {this.props.games.map( game => {

                        return(
                            <div key={game.id}>
                                <p className='inline'>{game.name}</p> - 
                                <p className='inline'>{game.dateTime}</p>
                                <button onClick={this.buttonClick} className='inline' id={game.id} link={game.mylink}>Tickets</button>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        ) 
    }
}

export default Games