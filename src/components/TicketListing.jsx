import {Component} from 'react'
import '../App.css'
import '../my.css';
import {Scatter} from 'react-chartjs-2'

let baseURL;

baseURL = 'http://localhost:3003'
console.log('current base URL: ' , baseURL)

class TicketListing extends Component{
    constructor(props){
        super(props)
        this.state = {
            test: 'my test',
            graphData: {},
        }
        this.run = this.run.bind(this)
    }

    componentDidMount(){
        let x = this.run()
        this.setState({
            graphData: x
        })
    }

    //this is the real run, need to make 'data' into and array of objects using x and y ie. [ {x:1, y:2} , ...]
    run(){
        let graphingData = []
        let labels = []
        for (let i = 0; i < this.props.ticketDetails.date_time.length; i++) {
            let timeStamp = this.props.ticketDetails.date_time[i];
            let ts = new Date(timeStamp)
            ts = Date.parse(ts)
            console.log(ts)
            let mydict = {x:ts , y: this.props.ticketDetails.price[i]}
            graphingData.push(mydict)
            labels.push(i)
        }
        
        // console.log(timeStampArr)
        let x = {
            // labels: this.props.ticketDetails.date_time,
            labels: this.props.ticketDetails.date_time,
            // labels: [0, 1, 2, 3,4,5],
            datasets: [
              {
                label: 'ticket price',
                xValueType: 'dateTime',
                showLine: true,
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                // data: this.props.ticketDetails.price,
                data: graphingData,
                // everything below this is new
              }
            ]
          }
          return x
    }

    // this works
    // run(){
    //     let x = {
    //         labels: ['one', 'two', 'three'],
    //         // labels:[1 , 5, 100],
    //         datasets: [
    //           {
    //             label: 'ticket price',
    //             showLine:true,
    //             fill: false,
    //             lineTension: 0.5,
    //             backgroundColor: 'rgba(75,192,192,1)',
    //             borderColor: 'rgba(0,0,0,1)',
    //             borderWidth: 1,
    //             data: [ {x:1 , y:1}, {x:5 , y:5}, {x:10 , y:100} ],
    //             // everything below this is new
    //           }
    //         ]
    //       }
    //       return x
    // }

    
    
    
    //functions

    render(){
        return(
            <div>
                <h2>Listing Details</h2>
                <h3>Location: {this.props.ticketDetails.location}</h3>
                <h3>Current Price: ${this.props.ticketDetails.lastPrice}</h3>
                <h3>Minimum Price: ${this.props.ticketDetails.min_price}</h3>
                <h3>Max Price: ${this.props.ticketDetails.max_price}</h3>
                <h3>Max Range: ${this.props.ticketDetails.price_range}</h3>
                <div id='app'>
                <Scatter
                    data={this.state.graphData}
                    type = 'line'
                    options={{                       // added stuff here
                        // scales: {
                        //     x: {
                        //         type: 'time'
                        //     }
                        // },
                        scales:{
                            xAxis: [{
                                type: 'time',


                                // position:'bottom',
                            }]
                        },
                        // to here
                        title:{
                            display:true,
                            text:'Average Rainfall per month',
                            fontSize:20
                        },
                        legend:{
                            display:true,
                            position:'right'
                        }
                    }}
                />

                </div>
            </div>
        )
    }
}

export default TicketListing