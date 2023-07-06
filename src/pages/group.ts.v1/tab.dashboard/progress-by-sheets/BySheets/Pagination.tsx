import React from 'react';
import styled from 'styled-components';

import { Button } from 'antd';

const Pagination = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: center;
  justify-content: stretch;

  width: 100%;

  margin-top: 1px;

  font-size: 0.9em;

  border-top: 1px solid #e8e8e8;

  padding: 1px 4px 5px;

  .page-number
  {
    flex-grow: 1;

    text-align: center;
  }
`;

interface Props
{
  page: number;
  pageCount: number;

  disabled?: boolean;

  onPrev (): void;
  onNext (): void;
}

const Comp: React.FC<Props> = (
  {
    page,
    pageCount,

    disabled,

    onPrev,
    onNext,
  }
) =>
{
  return (
    <Pagination>
      <Button 
        icon="arrow-left"
        shape="circle"
        type="link"
        disabled={page <= 1 || disabled}
        onClick={onPrev}
      />

      <div className="page-number" >
        {page} / {pageCount}
      </div>

      <Button 
        icon="arrow-right"
        shape="circle"
        type="link"
        disabled={page >= pageCount || disabled}
        onClick={onNext}
      />
    </Pagination>
  );
}

export default Comp;