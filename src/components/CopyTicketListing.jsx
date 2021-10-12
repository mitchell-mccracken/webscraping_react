import {Component} from 'react'
import '../App.css'
import '../my.css';
import {Scatter} from 'react-chartjs-2'
import Plot from 'react-plotly.js'

let baseURL;

baseURL = 'http://localhost:3003'
console.log('current base URL: ' , baseURL)

class CopyTicketListing extends Component{
    constructor(props){
        super(props)
        this.state = {
            test: 'my test',
            graphData: {},
        }
    }

    componentDidMount(){
        this.setState({
            graphData: 'test'
        })
    }

    //this is the real run, need to make 'data' into and array of objects using x and y ie. [ {x:1, y:2} , ...]


    
    
    
    //functions

    render(){
        return(
            <div>
                <h2>Listing Details</h2>
                <h3>{this.props.game} - {this.props.gameDate}</h3>
                <h3>Location: {this.props.ticketDetails.location}</h3>
                <h3>Current Price: ${this.props.ticketDetails.lastPrice}</h3>
                <h3>Minimum Price: ${this.props.ticketDetails.min_price}</h3>
                <h3>Max Price: ${this.props.ticketDetails.max_price}</h3>
                <h3>Max Range: ${this.props.ticketDetails.price_range}</h3>
                <div id='app'>
                <Plot 
                    data={[
                        {
                            x: this.props.ticketDetails.date_time,
                            y: this.props.ticketDetails.price,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: {color: 'blue'},
                        },
                    ]}
                    layout= {{
                        // width: 320, 
                        // height: 240, 
                        title: 'Ticket Prices'
                    }}
                />
                <br></br>
                <button onClick={this.props.backToTickets} >Back to Tickets</button>


                </div>
            </div>
        )
    }
}

export default CopyTicketListing