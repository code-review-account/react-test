import React from "react";
import ReactDOM from "react-dom";

class Row extends React.Component {
  render() {
    <React.Fragment>
      <tr>
        <td></td>
      </tr>
    </React.Fragment>
  }
}

class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people: []
    }
  }

  render() {
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of birth</th>
          <th>Height</th>
          <th>Weight</th>
          <th>Salary</th>
        </tr>
      </thead>
      <tbody>
        {this.state.people.map(function(element, index){
          <Row 
            person={element}
          />
        })}
      </tbody>
    </table>
  }
}

ReactDOM.render(<Table />, getElementById("root"));