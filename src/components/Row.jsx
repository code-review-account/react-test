import React from "react";
import styled, {css} from "styled-components";
import Checkbox from "./Checkbox";

const ActionButtonsWrap = styled.div`
  display: flex;
  width: max-content;
  margin-left: auto;
`;

const ActionBtn = styled.div`
  width: 22px;
  height: 24px;
  margin: 0 11px;
  cursor: pointer;

  ${props => props.edit && css`
    background: url("/icons/edit_btn.svg") no-repeat;
    &:hover{
      background: url("/icons/edit_btn_hover.svg") no-repeat;
    }
  `}

  ${props => props.remove && css`
    background: url("/icons/remove_btn.svg") no-repeat;
    &:hover{
      background: url("/icons/remove_btn_hover.svg") no-repeat;
    }
  `}
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
          <td className="person-number">{this.props.id}</td>
          <td className="person-name">{this.props.person.full_name}</td>
          <td className="person-age">{this.props.person.age}</td>
          <td className="person-height">{this.props.person.height}</td>
          <td className="person-weight">{this.props.person.weight}</td>
          <td className="person-salary">{this.props.person.salary}</td>

          {/* {this.props.person.map((item, index) => (
            <td key={index}>{item}</td>
          ))} */}
          <td>
            <ActionButtonsWrap>
              <ActionBtn edit/>
              <ActionBtn remove onClick={this.props.onRemove} />
            </ActionButtonsWrap>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}