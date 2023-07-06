import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import Modal from './Modal';
import Label from './Label';
import Divider from './Divider';

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  padding: 12px 14px;
`;

type ItemProps = 
  {
    id: string;
    name: string;
  }

type Props = 
  {
    items: ItemProps[];

    value: any;
    onChange?(value: any): void;

    footer?: any;
  }

const Comp: React.FC<Props> = (
  {
    items,

    value,
    onChange,

    footer,
  }
) =>
{
  const [isOpen, setOpen] = useState(false);

  function handleOpen ()
  {
    setOpen(true);
  }

  function handleClose ()
  {
    setOpen(false);
  }

  function handleChange (e: CheckboxChangeEvent)
  {
    if (onChange)
    {
      const name = e.target.name ?? '';
      const checked = e.target.checked;

      onChange({ ...value, [name]: checked });
    }
  }

  return (
    <>
      <Button
        type="primary"
        icon="setting"
        // ghost={true}
        size="small"
        style={{ lineHeight: 1 }}
        onClick={handleOpen}
      />
      <Modal 
        isOpen={isOpen}
        onClose={handleClose}
        // label={items?.length > 0 ? 'ตั้งค่าคอลัมน์' : ''}
      >
        {
          items?.length > 0 &&
          <>
            <Label>
              ตั้งค่าคอลัมน์
            </Label>
            <Divider />
            {
              items.map (
                ({ id, name }) =>
                {
                  return (
                    <div 
                      key={id}
                      style={{ padding: `12px 13px` }}
                    >
                      <Checkbox
                        name={id}
                        checked={value[id]}
                        onChange={handleChange}
                      >
                        {name}
                      </Checkbox>
                    </div>
                  );
                }
              )
            }
          </>
        }
        {
          footer &&
          <>
            {
              items?.length > 0 &&
              <Divider />
            }
            <Footer>
              {footer}
            </Footer>
          </>
        }
      </Modal>
    </>
  );
}

export default Comp;