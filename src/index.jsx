import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import CallApi from "./api";
import Row from "./components/Row";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";


const Styles = styled.div`
  width: 1200px;
  margin: auto;

  h1 {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    line-height: normal;
    color: #4c4c4c;
  }

  table {
    border-radius: 6px;
    background: #ffffff;
    margin: auto;
    width: 100%;
    margin: 16px 0 24px;
    padding: 0 0 16px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #f5f5f5;
    border-spacing: 0;
  }

  thead {
    background: #f0f0f0;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #4c4c4c;
  }

  tbody tr:nth-child(2n){
    background: #fafafa !important;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
  }

  td {
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    color: #4c4c4c;
    min-height: 48px;
  }

  th:nth-child(1),
  th:nth-child(2),
  td:nth-child(1),
  td:nth-child(2){
    width: 20px;
  }


`;

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
    data.forEach((element, i) => {
      let person = {};
      person.id = i+1;
      person.full_name = element.first_name + " " + element.last_name;
      person.age = Math.round((Date.now()/1000 - element.date_of_birth) / (3600 * 24 * 365));
      person.height = this.convertHeight(element.height);
      person.weight = Math.round(this.convertWeight(element.weight));
      person.salary = element.salary;//TODO перевести в $
      loadedPeople.push(person);
    });
    this.setState({
      people: loadedPeople, 
      checked: new Array(loadedPeople.length).fill(false)
    });
  }

  handleRowCheck(id, event){
    const checked = event.target.checked;
    let newCheckedState = this.state.checked.slice();
    if(event.nativeEvent.shiftKey){
      if(this.state.checked.includes(true)){
        const lastChecked = this.state.checked.indexOf(true);
          newCheckedState = newCheckedState.map((elem, i) => {
            if((i >= id && i <= lastChecked) || elem === true) {
              return elem = true;
            }
            else if((i <= id && i >= lastChecked)) {
              return elem = true;
            }
            return false;
          });
      }
    }
    newCheckedState[id] = checked;
    this.setState({checked: newCheckedState});
  }

  handleHeadingCheck(event){
    const checked = event.target.checked;
    let newChecked = this.state.checked.slice();
    newChecked = newChecked.fill(checked);
    this.setState({checked: newChecked});
  }

  handleRowRemoveClick(id){
    let newChecked = this.state.checked.filter((item, index) => index !== id);
    let newPeople = this.state.people.filter((item, index) => index !== id);
    this.setState({people: newPeople, checked: newChecked});
  }

  handleRemoveChecked(){
    let checkedIds = this.state.checked.slice().reduce((arr, elem, index) => {
      if(elem === true) arr.push(index);
        return arr;
    }, []);
    let newChecked = this.state.checked.filter((item, index) => !checkedIds.includes(index));
    let newPeople = this.state.people.filter((item, index) => !checkedIds.includes(index));
    this.setState({people: newPeople, checked: newChecked});
  }

  render() {//выкинуть все это в компонент table, слишком грязно, тут оставить только App, в котором будет исключительно <Table />
    const colsList = ["№", "ФИО", "Возраст(лет)", "Рост", "Вес", "Зарплата", ""]

    return(
      <Styles>
        <h1>
          Таблица пользователей
        </h1>
          <table>{/* component Table */}
            <thead>{/* component Table Head */}
              <tr>
                <th>
                <Checkbox 
                  onCheckChange={(event) => this.handleHeadingCheck(event)}
                  checked={!this.state.checked.includes(false)}
                />
                </th>
                {colsList.map((item, index) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>{/* component Table Body */}
            {this.state.people.map((element, index) => (
              <Row 
                key={index}
                person={Object.values(element)}
                onCheckStateChanged={(event) => this.handleRowCheck(index, event)}
                onRemove={() => this.handleRowRemoveClick(index)}
                checked={this.state.checked[index]}
              />
            ))}
          </tbody>
          </table>
        <Button
          onDeleteClick={() => this.handleRemoveChecked()}
          disabled={!this.state.checked.includes(true)}
        />
      </Styles>
    );
  }
}

ReactDOM.render(<Table />, document.getElementById("root"));