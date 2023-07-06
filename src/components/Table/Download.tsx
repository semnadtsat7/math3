import React from 'react';
import { Button } from 'antd';

type Props = 
  {
    label?: string;
    onClick?: Function;
  }

const Comp: React.FC<Props> = (
  {
    label,
    onClick,
  }
) =>
{
  function handleClick ()
  {
    if (typeof onClick === 'function')
    {
      onClick();
    }
  }

  return (
    <Button
      type="primary"
      icon="download"
      // ghost={true}
      // size="small"
      style={{ lineHeight: 1 }}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}

Comp.defaultProps = 
{
  label: 'ดาวน์โหลดข้อมูลตาราง',
}

export default Comp;