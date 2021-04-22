import React from "react";
import styled from "styled-components";

const StyledCol = styled.td`
  padding: 9px 15px;
  font-size: 14px;
  font-family: 'Roboto';
  color: #4c4c4c;
  min-height: 48px;
  
  ${'' /* flex-basis: 100%; */}
  
  ${'' /* margin: 4px 47px 7px 146px; */}
`;

const BtnWrap = styled.div`
  display: flex;
  width: max-content;
  margin-left: auto;
`;


const StyledRow = styled.tr`
  ${'' /* padding: 12px 27px 12px 20px; */}

  ${'' /* display: flex;
  flex-flow: row; */}

  &:nth-child(2n+1){background: #fafafa !important;}
  &:nth-child(2n){background: #ffffff;}
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
          <StyledCol>
            <BtnWrap>
            {/* TODO в отдельный компонент */}
              <button onClick={this.props.onRemove}>R</button>
              <button onClick={this.props.onRemove}>R</button>
            </BtnWrap>
          </StyledCol>
        </StyledRow>
      </React.Fragment>
    );
  }
}