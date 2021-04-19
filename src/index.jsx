import React from "react";
import ReactDOM from "react-dom";
import CallApi from "./api";

//Чекбокс, No, Фио, возраст, рост, вес, зарплата, 

class Row extends React.Component {
  render() {
    return(
      <React.Fragment>
        <tr>
          <td>
            <input 
              onChange={(event) => this.props.onCheckStateChanged(event.target.checked)} 
              type="checkbox" 
              checked={this.props.checked}
              >
            </input>
          </td>
          {/* Присылать сюда пропсы массивом, чтобы обходить тут через map */}
          <td>{this.props.person.full_name}</td>
          <td>{this.props.person.age}</td>
          <td>{this.props.person.height}</td>
          <td>{this.props.person.weight}</td>
          <td>{this.props.person.salary}</td>
          <td><button onClick={this.props.onRemove}>Remove</button></td>
        </tr>
      </React.Fragment>
    );
  }
}

class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people: [],
      checked: []
    }
    
    this.getPeopleDetails = this.getPeopleDetails.bind(this);
    this.getPeopleDetails();
  }

  getPeopleDetails(){
    CallApi.getPeopleData()
      .then(data => {
        this.preparePeopleDetails(data);
      });
  }

  convertHeight(oldHeight) {//TODO проверить правильность расчета вручную
    let pd = oldHeight.replace("\"", "");
    pd = pd.split("'");
    let smFull = pd[0]*30.48 + pd[1]*2.54;
    let mSm = 0;
    if(smFull > 200)
      mSm = "2м " + Math.round(smFull-200) + "см";
    else if(smFull >100)
      mSm = "1м " + Math.round(smFull-100) + "см";
    else
      mSm = smFull + "см";
    return mSm;
  }

  convertWeight(oldWeight) {
    return oldWeight * 0.453592;
  }

  preparePeopleDetails(data){
    let loadedPeople = [];
    data.forEach(element => {
      let person = {};
      person.full_name = element.first_name + " " + element.last_name;
      person.age = Math.round((Date.now()/1000 - element.date_of_birth) / (3600 * 24 * 365));
      person.height = this.convertHeight(element.height);
      person.weight = Math.round(this.convertWeight(element.weight));
      person.salary = element.salary;
      loadedPeople.push(person);
    });
    this.setState({
      people: loadedPeople, 
      checked: new Array(loadedPeople.length).fill(false)
    });
  }

  handleRowCheck(id, checked){
    const newChecked = this.state.checked.slice();
    newChecked[id] = checked;
    this.setState({checked: newChecked});
  }

  handleHeadingCheck(checked){
    let newChecked = this.state.checked.slice();
    newChecked = newChecked.fill(checked);
    this.setState({checked: newChecked});
  }

  handleRemoveClick(id){
    let newChecked = this.state.checked.filter((item, index) => index !== id);
    let newPeople = this.state.people+.filter((item, index) => index !== id);
    this.setState({people: newPeople, checked: newChecked});
  }

  render() {
    return(
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={(event) => this.handleHeadingCheck(event.target.checked)}></input></th>
            <th>ФИО</th>
            <th>Возраст(лет)</th>
            <th>Рост</th>
            <th>Вес</th>
            <th>Зарплата</th>
          </tr>
        </thead>
        <tbody>
          {this.state.people.map((element, index) => (
            <Row 
              key={index}
              person={element}
              onCheckStateChanged={(checked) => this.handleRowCheck(index, checked)}
              onRemove={() => this.handleRemoveClick(index)}
              checked={this.state.checked[index]}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

ReactDOM.render(<Table />, document.getElementById("root"));