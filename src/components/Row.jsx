import React from "react";
import styled from "styled-components";

const BtnWrap = styled.div`
  display: flex;
  width: max-content;
  margin-left: auto;
`;

//input можно получается будет представить в качестве div где выбранный будет подсвечиваться через before-элемент?

export default class Row extends React.Component {
  render() {
    return(
      <React.Fragment>
        <tr>
          <td>
            <input 
              onChange={(event) => this.props.onCheckStateChanged(event)} 
              type="checkbox" 
              checked={this.props.checked}
              >
            </input>
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