import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import NumberUtil from '../../../../../../utils/NumberTS';

import { Filter } from '../../utils/Filter';

import Layer from '../../../../../../components/Layer';

import Card from '../../../../../../components/Table/Filter/Dropdown/Modal/Card';
import CardLabel from '../../../../../../components/Table/Filter/Dropdown/Modal/CardLabel';
import CardContent from '../../../../../../components/Table/Filter/Dropdown/Modal/CardContent';
import CardItem from './CardItem';

import Close from '../../../../../../components/Table/Filter/Dropdown/Modal/Close';

const Popup = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 1;

  align-items: stretch;
  justify-content: center;
  
  font-size: 0.9em;

  .item
  {
    width: 50%;

    margin: 8px 0;

    flex-shrink: 1;
    flex-grow: 1;
  }
`;

export type ItemProps =
{
  _id: string;

  label: string | number | React.ReactNode;
  x: number;
  y: number;
};

interface Props
{
  isOpen: boolean;

  filter: Filter;
  groupID: string;

  label: string | number | React.ReactNode;
  items: ItemProps[];

  onClose?(): void;

  x:
  {
    label: string;
  };

  y:
  {
    label: string;
  };
}

const Comp: React.FC<Props> = (
  {
    isOpen,

    filter,
    groupID,

    label,
    items,

    onClose,

    x,
    y,
  }
) =>
{
  return (
    <Layer 
      isOpen={isOpen} 
      layer={1}
      onClose={onClose}
    >
      <Card>
        <CardLabel>
          {label}
        </CardLabel>
        <CardContent>
          {
            items.map(
              item =>
              {
                const sheetID = filter.sheetID !== 'none' ? filter.sheetID : '';
                const quizTitle = filter.title !== 'none' ? filter.title : '';

                return (
                  <CardItem
                    key={`${item.label}-${item.x}-${item.y}`}
                  >
                    <Link to={`/students/${item._id}?sheetID=${sheetID}&quizTitle=${quizTitle}&group=${groupID}`} >
                      {item.label}
                    </Link>
                    <Popup>
                      <div className="item" >
                        <strong>{y.label}</strong>
                        <br />{NumberUtil.prettifyF(item.y, 1)}
                      </div>
                      <div className="item" >
                        <strong>{x.label}</strong>
                        <br />{NumberUtil.prettifyF(item.x, 1)}
                      </div>
                    </Popup>
                  </CardItem>
                );
              }
            )
          }
        </CardContent>
      </Card>
      <Close onClick={onClose} />
    </Layer>
  );
}

export default Comp;