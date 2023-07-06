import React from 'react';
import styled from 'styled-components';

import { Popover } from 'antd';

import NumberUtil from '../../../../utils/NumberTS';

import { COLORS } from '../constants';
import { OFFSET } from './constants';
import { Quiz } from '.';

import Link from './Link';

const SPACE = 10;

const Item = styled.div`
  position: relative;

  z-index: 1;

  margin: 6px 0;

  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: center;

  width: 100%;

  cursor: pointer;

  &.ant-popover-open
  {
    background: rgba(0,0,0, 0.12);
  }

  .label
  {
    flex-shrink: 0;

    font-size: 0.9em;

    width: ${OFFSET.XS - SPACE}px;
    margin-right: ${SPACE}px;

    overflow: hidden;
    white-space: nowrap;

    text-overflow: ellipsis;
    text-align: right;

    color: cornflowerblue;
    text-decoration: underline;

    pointer-events: none;
  }

  &:hover .label
  {
    filter: brightness(0.84);
  }

  .progress
  {
    width: 100%;
    height: 12px;

    flex-shrink: 1;
    flex-grow: 1;

    display: flex;

    .progress-pass
    {
      background: ${COLORS[0]};
    }

    .progress-not
    {
      background: ${COLORS[1]};
    }
  }

  @media (min-width: 576px)
  {
    .label
    {
      width: ${OFFSET.SM - SPACE}px;
    }
  }

  @media (min-width: 768px)
  {
    .label
    {
      width: ${OFFSET.MD - SPACE}px;
    }
  }

  @media (min-width: 992px)
  {
    .label
    {
      width: ${OFFSET.LG - SPACE}px;
    }
  }

  @media (min-width: 1200px)
  {
    .label
    {
      width: ${OFFSET.XL - SPACE}px;
    }
  }
`;

const Popup = styled.div`
  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;
  flex-shrink: 1;

  align-items: stretch;
  justify-content: center;

  p
  {
    margin: 10px auto;
  }

  ul
  {
    font-size: 0.9em;

    padding-inline-start: 0;
    padding: 0;

    list-style: none;

    margin: 0;
    
    display: flex;
    
    flex-direction: row;
    flex-wrap: nowrap;
  }

  li
  {
    margin: 8px 0;

    flex-shrink: 0;
  }

  li:not(:first-child)
  {
    margin-left: 16px;
  }

  hr
  {
    height: 1px;

    background-color: #e8e8e8;
    border: none;

    margin: 16px -16px;

    width: calc(100% + 32px);
  }
`;

interface Props
{
  sheetID: string;
  quiz: Quiz;
}

const Comp: React.FC<Props> = (
  {
    sheetID,
    quiz,
  }
) =>
{
  const { title, metrics, percentage } = quiz;

  return (
    <Popover
      key={title}
      placement="bottom"
      trigger="click"
      title={
        <strong>{title} ({NumberUtil.prettify(metrics.quiz)} ด่าน)</strong>
      }
      content={
        <Popup>
          <ul>
            <li style={{ color: COLORS[0] }} >
              <strong>ผ่านแล้ว <big>{NumberUtil.prettifyF(metrics.pass, 1)}</big> ด่าน</strong>
              <br />({NumberUtil.prettifyF(percentage.pass, 1)}%)
            </li>
            <li style={{ color: COLORS[1] }} >
              <strong>ยังไม่ผ่าน <big>{NumberUtil.prettifyF(metrics.not, 1)}</big> ด่าน</strong>
              <br />({NumberUtil.prettifyF(percentage.not, 1)}%)
            </li>
          </ul>
          <hr />
          <Link 
            sheetID={sheetID}
            quizTitle={title}
          />
        </Popup>
      }
    >
      <Item>
        <div className="label" >
          <label>
            {title}
          </label>
        </div>
        <div className="progress" >
          <span 
            className="progress-pass"
            style={{ width: `${percentage.pass}%` }}
          />
          <span 
            className="progress-not" 
            style={{ width: `${percentage.not}%` }}
          />
        </div>
      </Item>
    </Popover>
  );
}

export default Comp;