import React from 'react'
import styled from 'styled-components'

// import
// {
//   Select,
// } from 'antd'

import Flexbox from '../../../components/Flexbox';
import Footer from '../../../components/Table/Footer';

import Dropdown from '../../../components/Table/Filter/Dropdown';

import { Level } from './listenSummary';
import { Filter } from './utils/Filter';

// const { Option } = Select

interface IField
{
  align?: string;
}

const Field = styled.div<IField>`
    padding: 4px;
    flex-shrink: 0;

    display: flex;

    flex-direction: column;

    align-items: flex-start;
    justify-content: center;

    ${props => props.align === "right" && `
        align-items: flex-end;
    `}
`

// const Label = styled.label`
//   font-size: 90%;

//   margin-bottom: 4px;
//   margin-left: 9px;
// `

interface Props
{
  filter: Filter;

  // titles: string[];
  levels: Level[];

  onChange (filter: Filter): void;

  extra?: any;
}

const Comp: React.FC<Props> = (
  {
    filter,

    // titles,
    levels,

    onChange,

    extra,
  }
) =>
{
  function handleChange (name: string, value: any)
  {
    onChange({ ...filter, [name]: value });
  }

  return (
    <Footer>

      {
        extra &&
        <Field>
          {extra}
        </Field>
      }

      {
        levels && levels.length > 0 &&
        <Dropdown 
          label="ระดับ"
          value={filter.level}
          onChange={value => handleChange('level', value)}
          items={
            levels.map(e => { return { value: e._id, label: e.name } })
          }
        />
      }

      <Dropdown 
        label="จำนวนครั้ง"
        value={filter.play}
        onChange={value => handleChange('play', value)}
        items={
          [
            { value: 'none', label: 'ทั้งหมด' },
            { value: 'ever', label: 'อย่างน้อย 1 ครั้ง' },
            { value: 'never', label: 'ไม่เคยทำ' },
          ]
        }
      />
      
      {/* <Field>
        <Label>ระดับ</Label>
        <Select
          dropdownMatchSelectWidth={false}
          style={{ width: 160 }}
          size="small"
          value={filter.level}
          onChange={(value: string) => handleChange('level', value)}
        >
          {
            levels
              .map((level, i) =>
              {
                return (
                  <Option
                    key={level._id}
                    value={level._id}
                  >
                    {level.name}
                  </Option>
                )
              })
          }
        </Select>
      </Field>

      <Field>
        <Label>จำนวนครั้ง</Label>
        <Select
          dropdownMatchSelectWidth={false}
          style={{ width: 160 }}
          size="small"
          value={filter.play}
          onChange={(value: string) => handleChange('play', value)}
        >
          <Option value="none" >ทั้งหมด</Option>
          <Option value="ever" >อย่างน้อย 1 ครั้ง</Option>
          <Option value="never" >ไม่เคยทำ</Option>
        </Select>
      </Field> */}

      <Flexbox />
    </Footer>
  )
}

export default Comp