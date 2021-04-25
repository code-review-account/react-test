import React from "react";
import styled from "styled-components";
import Checkbox from "./Checkbox";

const BtnWrap = styled.div`
  display: flex;
  width: max-content;
  margin-left: auto;
`;

export default class Row extends React.Component {
  render() {
    return(
      <React.Fragment>
        <tr>
          <td>
            <Checkbox 
              onCheckChange={(event) => this.props.onCheckStateChanged(event)} 
              checked={this.props.checked}
            />
          </td>
          {this.props.person.map((item, index) => (
            <td key={index}>{item}</td>
          ))}
          <td>
            <BtnWrap>
              <button onClick={this.props.onRemove}>R</button>
              <button onClick={this.props.onRemove}>R</button>
            </BtnWrap>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}