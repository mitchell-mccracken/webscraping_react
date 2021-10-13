import { div } from 'prelude-ls';
import React, {Component} from 'react'
import './App.css';
import './my.css';

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

    }

  }


  render(){
    return (
      <div className="App">
        <h2>Penguins Ticket Tracker</h2>
                
      </div>
    )
  }

}
