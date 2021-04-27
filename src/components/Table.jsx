import React from "react";
import CallApi from "../api";
import Checkbox from "./Checkbox";
import Row from "./Row";
import Button from "./Button";

export default class Table extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        people: [],
        checked: []
      }
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
      const weightKg = Math.round(oldWeight * 0.453592);
      return weightKg + " кг";
    }

    convertSalary(eur) {
       const salaryUSD = Math.round(eur * this.state.currencyData.rates.USD);
       return "$" + salaryUSD;
    }

    convertDate(birth_date) {
      return Math.round((Date.now()/1000 - birth_date) / (3600 * 24 * 365))
    }
  
    preparePeopleDetails(){
      const data = this.state.people.slice();
      let loadedPeople = [];
      data.forEach((element, i) => {
        let person = {};
        person.full_name = element.first_name + " " + element.last_name;
        person.age = this.convertDate(element.date_of_birth);
        person.height = this.convertHeight(element.height);
        person.weight = this.convertWeight(element.weight);
        person.salary = this.convertSalary(element.salary);//TODO перевести в $
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
  
    componentDidMount() {
      Promise.all([
        CallApi.getPeopleData(),
        CallApi.getCurrencyData(),
      ]).then(([peopleRes, currencyRes]) => {
        this.setState({
          people: peopleRes,
          currencyData: currencyRes
        }, () => {
          this.preparePeopleDetails(peopleRes);
        });
      });
    }
  
    render() {//выкинуть все это в компонент table, слишком грязно, тут оставить только App, в котором будет исключительно <Table />
      const colsList = ["№", "ФИО", "Возраст(лет)", "Рост", "Вес", "Зарплата", ""]
  
      return(
        <React.Fragment>
          <h1>
            Таблица пользователей
          </h1>
            <table>
              <thead>
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
              <tbody>
              {this.state.people.map((element, index) => (
                <Row 
                  key={index}
                  id={index+1}
                  person={element}
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
        </React.Fragment>
      );
    }
  }