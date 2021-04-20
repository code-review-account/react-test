import React from "react";
import styled from "styled-components";

const StyledCol = styled.td`
  & {padding: 5px 15px;}
`;

const StyledRow = styled.tr`
  &:nth-child(2n+1){background: #fafafa;}
`;

//input можно получается будет представить в качестве div где выбранный будет подсвечиваться через before-элемент?

export default class Row extends React.Component {
  render() {
    return(
      <React.Fragment>
        <StyledRow>
          <StyledCol>
            <input 
              onChange={(event) => this.props.onCheckStateChanged(event.target.checked)} 
              type="checkbox" 
              checked={this.props.checked}
              >
            </input>
          </StyledCol>
          {this.props.person.map((item, index) => (
            <StyledCol key={index}>{item}</StyledCol>
          ))}
          <StyledCol><button onClick={this.props.onRemove}>Remove</button></StyledCol>
        </StyledRow>
      </React.Fragment>
    );
  }
}