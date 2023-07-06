import React, { Fragment } from 'react';
import styled from 'styled-components';

// import { Popover } from 'antd';

import NumberUtil from '../../../../../utils/NumberTS';

import { LABEL_CHAR_WIDTH } from './constants';

const RADIUS = 4;
const LABEL_WIDTH = 80;

interface ContainerProps
{
  offset: number;
}

const Container = styled.div<ContainerProps>`
  /* background: rgba(0, 128, 255, 0.025); */

  position: absolute;

  right: 4px;
  left: ${props => (props.offset * LABEL_CHAR_WIDTH) + 12}px;

  top: 30px;
  bottom: 30px;
`;

const Spot = styled.div`
  background-color: cornflowerblue;

  width: ${RADIUS * 2}px;
  height: ${RADIUS * 2}px;

  border-radius: 50%;
  
  position: absolute;

  cursor: pointer;
`;

const Label = styled.div`
  color: cornflowerblue;
  position: absolute;

  width: ${LABEL_WIDTH}px;
  max-width: ${LABEL_WIDTH}px;
  
  white-space: normal;
  text-align: center;

  font-size: 10px;
  line-height: 1.4;
`;

// const Popup = styled.div`
//   display: flex;

//   flex-direction: column;
//   flex-wrap: nowrap;
//   flex-shrink: 1;

//   align-items: stretch;
//   justify-content: center;
  
//   font-size: 0.9em;

//   .item
//   {
//     margin: 8px 0;

//     flex-shrink: 1;
//     flex-grow: 1;
//   }
// `;

interface Item
{
  _id: string;
  label: string;
  x: number;
  y: number;
}

interface Props
{
  offset: number;
  items: Item[];

  x:
  {
    label: string;
    max: number;
  };

  y:
  {
    label: string;
    max: number;
  };
}

const Comp: React.FC<Props> = (
  {
    offset,
    items,

    x,
    y,
  }
) =>
{
  return (
    <Container offset={offset} >
      {
        items.map (
          item =>
          {
            const px = NumberUtil.percentage(item.x, x.max);
            const py = NumberUtil.percentage(item.y, y.max);

            return (
              <Fragment
                key={item._id}
              >
                <Spot 
                  style={
                    {
                      left: `calc(${px}% - ${RADIUS}px)`,
                      bottom: `calc(${py}% - ${RADIUS}px)`,
                    }
                  }
                />
                {/* <Popover
                  key={item._id}
                  placement="bottom"
                  trigger="click"
                  title={
                    <strong>{item.label}</strong>
                  }
                  content={
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
                  }
                >
                  <Spot 
                    style={
                      {
                        left: `calc(${px}% - ${RADIUS}px)`,
                        bottom: `calc(${py}% - ${RADIUS}px)`,
                      }
                    }
                  />
                </Popover> */}
                <Label 
                  style={
                    {
                      left: `calc(${px}% - ${LABEL_WIDTH / 2}px)`,
                      bottom: `calc(${py}% + ${RADIUS * 2}px)`,
                    }
                  }
                >
                  <label>{item.label}</label>
                </Label>
              </Fragment>
            );
          }
        )
      }
    </Container>
  );
}

export default Comp;