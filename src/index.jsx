import React from "react";
import ReactDOM from "react-dom";
import styled, { css } from 'styled-components';
import CallApi from "./api";
import Row from "./components/Row";

const DelBtn = styled.div`
  color: #dbdbdb;
  background: white;
  border: 2px solid #dbdbdb;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  width: max-content;
  padding: 10px 20px;
  margin-left: auto;
  margin-top: 20px;
  cursor: pointer;
  ${props => !props.disabled && css`
    color: white;
    background: #0085be;
    border: 2px solid #0085be;
    &:hover {
      background: #02597e;
      border: 2px solid #02597e;
    }
    &:active {
      background: #002abe;
      border: 2px solid #002abe;
    }
  `}
`;

class Button extends React.Component {
  render() {
    return (
      <DelBtn disabled={this.props.disabled} onClick={this.props.onDeleteClick}>
        Удалить выбранные
      </DelBtn>
    );
  }
}

//TODO можно запилить константу со списком полей в таблице же
const TableWrap = styled.div`
  width: max-content;
  margin: auto;
`;

const StyledTable = styled.table`
  border-radius: 15px;
  background: #f0f0f0;
  margin: auto;
  border-collapse: collapse;
`;

const StyledTh = styled.td`
  &{padding: 5px 15px;}
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
    data.forEach(element => {
      let person = {};
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
    let newPeople = this.state.people.filter((item, index) => index !== id);
    this.setState({people: newPeople, checked: newChecked});
  }

  handleMultipleRemove(){
    let checkedIds = this.state.checked.slice().reduce((arr, elem, index) => {
      if(elem === true) arr.push(index);
        return arr;
    }, []);
    let newChecked = this.state.checked.filter((item, index) => !checkedIds.includes(index));
    let newPeople = this.state.people.filter((item, index) => !checkedIds.includes(index));
    this.setState({people: newPeople, checked: newChecked});
  }

  render() {
    const colsList = ["ФИО", "Возраст(лет)", "Рост", "Вес", "Зарплата"]

    return(
      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>
                <input 
                  type="checkbox" 
                  onChange={(event) => this.handleHeadingCheck(event.target.checked)} 
                  checked={!this.state.checked.includes(false)}>
                </input>
              </StyledTh>
              {colsList.map((item, index) => (
                <StyledTh key={index}>{item}</StyledTh>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.people.map((element, index) => (
              <Row 
                key={index}
                person={Object.values(element)}
                onCheckStateChanged={(checked) => this.handleRowCheck(index, checked)}
                onRemove={() => this.handleRemoveClick(index)}
                checked={this.state.checked[index]}
              />
            ))}
          </tbody>
        </StyledTable>
        <Button
          onDeleteClick={() => this.handleMultipleRemove()}
          disabled={!this.state.checked.includes(true)}
        />
      </TableWrap>
    );
  }
}

ReactDOM.render(<Table />, document.getElementById("root"));