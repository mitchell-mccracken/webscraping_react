// import { div } from 'prelude-ls';
import React, {Component} from 'react'
import './App.css';
import './my.css';
import Games from './components/Games'
import Details from './components/Details';
// import TicketListing from './components/TicketListing'
import CopyTicketListing from './components/CopyTicketListing'

let baseURL;

if(process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3003'
} else {
  baseURL = 'https://piratesws.herokuapp.com'
}

// baseURL = 'http://localhost:3003'
console.log('current base URL: ' , baseURL)

export default class App extends Component {
  constructor(props){
    super(props)
      this.state = {
      test: true,
      games:[], 
      new:'',
      mygame: {},
      collections: [],
      displayGames: false,
      displayTickets: false,
      displayedType: '',
      gameLink: '',
      gameDetails: '',
      showGameDetails: false,
      game: '',
      gameDate: '',
      showTicketDetails: false,
      ticketDetails: '',

    }

    this.toggleDisplayGames = this.toggleDisplayGames.bind(this)
    this.getHomeGames = this.getHomeGames.bind(this)
    this.getAwayGames = this.getAwayGames.bind(this)
    this.hideGames = this.hideGames.bind(this)
    this.chooseGame = this.chooseGame.bind(this)
    this.getGameDate = this.getGameDate.bind(this)
    this.getTicketDetails = this.getTicketDetails.bind(this)
    // this.matchesID = this.matchesID.bind(this)
    this.backToTickets = this.backToTickets.bind(this)

  }

  backToTickets(){
    this.setState({
      showTicketDetails: false,
      displayTickets: true,
    })
  }

  async hideGames(link){
    await this.setState({
      // displayGames: false,
      // displayTickets: true,
      gameLink: link,
    })
    await this.getGameDetails(this.state.gameLink)
  }

  async getGameDetails(link){
    try{
      await fetch(baseURL+'/api/event/' + link)
      .then(data => {return data.json()}, err => console.log(err))
      .then(parsedData => this.setState({gameDetails: parsedData}), err => console.log(err))
    } finally {
      this.setState({
        displayGames:false,
        displayTickets: true,
      })
    }  
  }

  componentDidMount(){
    console.log('component mounted')
    this.getGames()
    this.getCollections()
    // this.getBBQuotes()
  }

   getTicketDetails(ticketDetails){
     console.log('ticket details')
     let listingDetails
     for (let i = 0; i < this.state.gameDetails.length; i++) {
       let element = this.state.gameDetails[i];
       if (element._id === ticketDetails){
         listingDetails = element
       }
     }
     this.setState({
       ticketDetails: listingDetails,
       showTicketDetails: true,
       displayTickets: false,
     })

  }

  checkDisplayState(displayType){
    if (this.state.displayedType === displayType && this.state.displayGames){
      this.setState({
        displayGames: false,
      })
    } else {
      this.setState({
        displayGames: true,
      })
    }
  }

  formatGameName(game){
    let gameArr = game.split("_")
    let newArr = []
    let gameString = ''
    for (let i = 0; i < gameArr.length-1; i++) {
        let word = gameArr[i];
        newArr.push(word)
    }
    gameString = newArr.join(' ')
    return gameString
}

  //update this one !!!!!!
  chooseGame(game){
    game = this.formatGameName(game)
    this.setState({
      game: game,
    })
  }

  getGameDate(date){
    // let dateArr = date.split('')
    let year = date.substring(0,4)
    let month = date.substring(5,7)
    let day = date.substring(8,10)
    let formatDate = month + '/' + day + '/' + year
    this.setState({
      gameDate: formatDate
    })
  }

  getHomeGames(){
    let homeGames = []
    let currentDate = new Date()
    for (let i = 0; i < this.state.collections.length; i++) {
      let game = this.state.collections[i];
      let gameDate = new Date(game.dateTime)
      if (game.home && gameDate>currentDate){
        homeGames.push(game)
      }
    }
    this.checkDisplayState('Home')
    this.setState({
      games: homeGames,
      displayedType: 'Home',
      displayTickets: false,
      showTicketDetails: false,
    })
  }

  getAwayGames(){
    let awayGames = []
    let currentDate = new Date()
    for (let i = 0; i < this.state.collections.length; i++) {
      let game = this.state.collections[i];
      let gameDate = new Date(game.dateTime)
      if (!game.home && gameDate>currentDate){
        awayGames.push(game)
      }
    }
    this.checkDisplayState('Away')
    this.setState({
      games: awayGames,
      displayedType:'Away',
      displayTickets: false,
      showTicketDetails: false,
    })
  }

  toggleDisplayGames(){
    this.checkDisplayState('All')
    this.setState({
      games: this.state.collections,
      displayedType:'All',
      displayTickets: false,
      showTicketDetails: false,
    })
  }

  getGames() { 
    fetch(baseURL + '/mytest')
    .then(data => {console.log(data);  return data.json()}, err => console.log(err))
    .then(parsedData => this.setState({new: 'mitch', mygame:parsedData}), err => console.log(err))
  }

  getCollections() { 
    fetch(baseURL + '/api/collections')
    .then(data => {return data.json()}, err => console.log(err))
    .then(parsedData => this.setState({collections: parsedData}), err => console.log(err))
  }

  getBBQuotes() {
    fetch('https://breaking-bad-quotes.herokuapp.com/v1/quotes')
    .then(data => { console.log(data); return data.json()}, err => console.log(err))
    .then(parsedData => this.setState({new:'bb quote', games:parsedData}), err => console.log(err))
  }

  render(){
    return (
      <div className="App">
        <h2>Penguins Ticket Tracker</h2>
        <h3>
        games tracked: {this.state.collections.length}
        </h3>
        <button onClick={this.toggleDisplayGames} >All Games</button>
        <button onClick={this.getHomeGames}>Home Games</button>
        <button onClick={this.getAwayGames}>Away Games</button>

        {/* this section is for displaying specific listing details */}
        {this.state.showTicketDetails &&
          <CopyTicketListing
            ticketDetails = {this.state.ticketDetails}
            backToTickets = {this.backToTickets}
            game = {this.state.game}
            gameDate = {this.state.gameDate}
          />
        }

        {/* this section is for display all game tickets */}
        {this.state.displayTickets && 
          <Details
            gameDetails = {this.state.gameDetails}
            game = {this.state.game}
            date = {this.state.gameDate}
            ticketDetails = {this.getTicketDetails}
            
          />
        }

        {/* this section is for displaying games */}
        {this.state.displayGames && 
          <Games
            games={this.state.games}
            hideGames = {this.hideGames}
            chooseGame = {this.chooseGame}
            getGameDate = {this.getGameDate}
            displayType = {this.state.displayedType}
          />
        }        
        
      </div>
    )
  }

}
