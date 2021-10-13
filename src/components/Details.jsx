import {Component} from 'react'
import '../App.css'
import '../my.css';

let baseURL;

if(process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3003'
} else {
  baseURL = 'https://piratesws.herokuapp.com'
}
console.log('current base URL: ' , baseURL)

class Details extends Component{
    constructor(props){
        super(props)
        this.state = {
            detailsTest : 'details test',
            filteredTickets: [],
            buttonClicked: false,
            listingCount: 0,
            header: 'All Tracked Listings',
            gameName: '',
        }

        this.availableSeats = this.availableSeats.bind(this)
        // this.formatGameName = this.formatGameName.bind(this)
        this.buttonClicked = this.buttonClicked.bind(this)
        this.getAllSeats = this.getAllSeats.bind(this)
        this.compareRange = this.compareRange.bind(this)
        this.getTopChangedSeats = this.getTopChangedSeats.bind(this)
        this.fitlerForLowerBowl = this.fitlerForLowerBowl.bind(this)
        this.lowerBowlSeats = this.lowerBowlSeats.bind(this)
    }

    //functions
    async componentDidMount(){
        await this.availableSeats()
    }

    async getAllSeats(){
        let ticketArr = this.props.gameDetails
        let sortedTickets = []
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i]
            ticket.lastPrice = ticket.price[ticket.price.length-1]*1
            sortedTickets.push(ticket)           
        }
        await sortedTickets.sort(this.compareLastPrice)
        await this.setState({
            // filteredTickets: this.props.gameDetails,
            filteredTickets: sortedTickets
        })
        await this.listingCount()
    }

    async getTopChangedSeats(){
        console.log('top change seats clicked')
        let ticketArr = await this.props.gameDetails;
        await ticketArr.sort(this.compareRange)
        await this.setState({
            filteredTickets: ticketArr,
        })
        await this.listingCount()
    }

    listingCount(){
        let count =  this.state.filteredTickets.length
        this.setState({
            listingCount: count,
        })
    }

    fitlerForLowerBowl(tickets){
        let lowerBowlTickets = []
        for (let i = 0; i < tickets.length; i++) {
            let ticket = tickets[i];
            if (ticket.location.split('_')[0]*1 < 200) {
                lowerBowlTickets.push(ticket)
            }
        }
        return lowerBowlTickets
    }

    async lowerBowlSeats(){       
        await this.setState({
            header: 'Lower Bowl Listings'
        })
        let currentTickets = await this.getCurrentTickets()
        let lowerBowlTickets = await this.fitlerForLowerBowl(currentTickets)
        await this.setState({
            filteredTickets: lowerBowlTickets,
            listingCount: lowerBowlTickets.length
        })

    }

    async availableSeats(){
        await this.setState({
            buttonClicked: true,
            header: 'Available Listings'
        })
        // this.getLastTimeUpdate()
        let currentTickets = await this.getCurrentTickets()
        await this.setState({
            filteredTickets: currentTickets,
        })
        await this.listingCount()     
    }

    getLastTimeUpdate(){
        let lastTime = new Date(0)
        for (let i = 0; i < this.props.gameDetails.length; i++) {
            let ticket = this.props.gameDetails[i];
            let lastTicketTime = new Date( ticket.date_time[ticket.date_time.length-1] )
            if (lastTicketTime > lastTime){
                lastTime = lastTicketTime
            }
        }
        console.log('last time was :' + lastTime)
        console.log(lastTime +2)
        return lastTime
    }

    buttonClicked(event){
        console.log('button clicked')
        console.log(event.target.id)
        // console.log(event.target)
        this.props.ticketDetails(event.target.id)
    }

    compareLastPrice(a,b){
        //this is to sort low to high
        const rangeA = a.lastPrice
            const rangeB = b.lastPrice
            let comparison = 0;
            if (rangeA > rangeB) {
            comparison = 1;
            } else if (rangeA < rangeB) {
            comparison = -1;
            }
            return comparison*1;       //sort from low to high
    }

    compareRange(a,b){
        const rangeA = a.price_range
        const rangeB = b.price_range
        let comparison = 0;
        if (rangeA > rangeB) {
        comparison = 1;
        } else if (rangeA < rangeB) {
        comparison = -1;
        }
        return comparison*-1;       //sort from high to low
        
    }

    getCurrentTickets(){
        let lastTime = Date.parse(this.getLastTimeUpdate())
        console.log(lastTime)
        let currentTickets = []
        
        for (let i = 0; i < this.props.gameDetails.length; i++) {
            let ticket = this.props.gameDetails[i];
            let ticketTime = new Date(ticket.date_time[ticket.date_time.length-1])
            ticketTime = Date.parse(ticketTime)
            // console.log(ticketTime)
            if ( ticketTime == lastTime) {
                // console.log('match!')
                ticket.lastPrice = ticket.price[ticket.price.length-1]*1
                currentTickets.push(ticket)
            }
        }

        currentTickets.sort(this.compareLastPrice)      //I probably dont need this since they are already sorted

        return currentTickets

    }


    render(){
        return(
            <div >
                <h2>{this.state.header}</h2>
                <h2>{this.props.game}</h2>
                <h2>{this.props.date}</h2>
                <h3>Listings Shown: {this.state.listingCount}</h3>
                <button onClick={this.getAllSeats} className='inline'>All Seats</button>
                <button onClick={this.availableSeats} className='inline'>Available Seats</button>
                <button onClick={this.getTopChangedSeats} className='inline'>Top Changed Seats</button>
                <button onClick={this.lowerBowlSeats}>Lower Bowl</button>
                <div className='details_parent_div' >
                    {this.state.filteredTickets.map( ticket => {
                        return(
                            <div onClick={this.buttonClicked} className='ticketbox' id={ticket.listing_id} key={ticket.listing_id}>
                                <h5 id={ticket.listing_id}>Section: {ticket.location.split('_')[0]}</h5>
                                <h5 id={ticket.listing_id}>Row: {ticket.location.split('_')[1]}</h5>
                                <h5 id={ticket.listing_id}>Qty: {ticket.location.split('_')[2]}</h5>
                                <h5 id={ticket.listing_id}>current price: {ticket.price[ticket.price.length-1]}</h5>
                                <h5 id={ticket.listing_id}>price range: {ticket.price_range}</h5>
                            </div>
                        )
                    })}
                    
                </div>
                
            </div>
        )
    }
}

export default Details