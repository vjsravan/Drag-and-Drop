import React, { Component } from 'react';
import { parse } from "papaparse";
import './App.css';
import _  from 'lodash';

import Drag from "./draganddrop";

class App extends Component {
  state = {
    sales: [],
    countrys: []
  }
  
  render() {
  return (
    <div>
      <h1>EVALUATION EXERCISE </h1> <br/>
      <h2>Drag & Drop</h2>
      <div

        onDragOver={(e) => {
          e.preventDefault();
        }}

        onDrop={(e) => {
          e.preventDefault();

          Array.from(e.dataTransfer.files)
          // .filter((file) => file.type === "application/vnd.ms-excel","text/csv")
          .forEach(async (file) => {
            const text = await file.text();
            const result = parse(text);
            result.data.shift();
            console.log(result);
            // remove header row and extract the data into state
          this.setState({
              sales: [...result.data]
          } ,()=>{
              // get unique list of countries from data
              const countryList = this.state.sales.map(row => {return {name: row[1]};});
              this.setState({ countrys :_.uniqBy(countryList, 'name')});
            });
          });
        }}
      >
      <p>DROP HERE</p>
      <div>
        {
          this.state.countrys.length > 0 &&
          <Drag countrys={this.state.countrys} sales={(this.state.sales)}></Drag>
        }
      </div>
      </div>
    </div>
  );
    }
}

export default App;
