import React from 'react';
import styled from 'styled-components';

import { Checkbox } from 'antd';

import
{
  TableCell,
  TableRow,
} from '@material-ui/core'

import ColumnLevel from '../../../components/Column.Level';
import { Quiz } from './listenSheet';

const Clickable = styled.div`
  border: none;
  background-color: transparent;

  color: cornflowerblue;
  text-decoration: underline;
  
  cursor: pointer;
  outline: none;

  padding: 14px 24px;

  display: flex;

  &:hover
  {
      text-decoration: underline;
      background: rgba(0,0,0, 0.05);
  }
`

const Action = styled.div`
    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`

interface Props
{
  quiz: Quiz;

  onAdd (quizID: string): void;
  onRemove (quizID: string): void;

  onOpen (quizID: string): void;
}

const Comp: React.FC<Props> = (
  {
    quiz,

    onAdd,
    onRemove,

    onOpen,
  }
) =>
{
  return (
    <>
      <TableRow
        hover={true}
      >
        <TableCell padding="none">
          <Action>
            {
              quiz.active ?
              <Checkbox 
                checked={quiz.active} 
                onChange={() => onRemove (quiz._id)} 
              />
              :
              <Checkbox 
                checked={quiz.active} 
                onChange={() => onAdd (quiz._id)} 
              />
            }
          </Action>
        </TableCell>
        <TableCell
          align="right"
          padding="checkbox"
        >
          {quiz.order}
        </TableCell>

        <TableCell padding="none" >
          <Clickable
            onClick={() => onOpen (quiz._id)} 
          >
            {quiz.title}
          </Clickable>
        </TableCell>
        <TableCell
          align="right"
          padding="checkbox"
        >
          <ColumnLevel level={quiz.level} />
        </TableCell>
      </TableRow>
    </>
  )
}

export default Comp