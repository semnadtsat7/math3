import React from 'react'
import styled from 'styled-components'

// import
// {
//   Select,
// } from 'antd'

// import
// {
//   Paper,
// } from '@material-ui/core'

import Flexbox from '../../../components/Flexbox';
import Footer from '../../../components/Table/Footer';

import Dropdown from '../../../components/Table/Filter/Dropdown';

import { Sheet, Level } from './listenSheet';
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

  sheets: Sheet[];
  titles: string[];
  levels: Level[];

  onChange (filter: Filter): void;

  extra?: any;
}

const Comp: React.FC<Props> = (
  {
    filter,

    sheets,
    titles,
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
      {extra && <Field>{extra}</Field>}

      {
        sheets.length > 0 &&
        <Dropdown 
          label="บทเรียน"
          value={filter.sheetID}
          onChange={value => handleChange('sheetID', value)}
          items={
            sheets.map(e => { return { value: e._id, label: e.title } })
          }
        />
      }

      {
        titles && titles.length > 0 &&
        <Dropdown 
          label="บทเรียนย่อย"
          value={filter.title}
          onChange={value => handleChange('title', value)}
          items={
            [{ value: 'none', label: 'ทั้งหมด' }].concat(
              titles.map(e => { return { value: e, label: e } })
            )
          }
        />
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
      {/* {
        sheets.length > 0 &&
        <Field>
          <Label>บทเรียน</Label>
          <Select
            dropdownMatchSelectWidth={false}
            style={{ width: 160 }}
            size="small"
            value={filter.sheetID}
            onChange={(value: string) => handleChange('sheetID', value)}
          >
            {
              sheets
                .map(sheet =>
                {
                  return (
                    <Option
                      key={sheet._id}
                      value={sheet._id}
                    >
                      {sheet.title}
                    </Option>
                  )
                })
            }
          </Select>
        </Field>
      }

      {
        titles.length > 0 &&
        <Field>
          <Label>บทเรียนย่อย</Label>
          <Select
            dropdownMatchSelectWidth={false}
            // showSearch={true}
            style={{ width: 160 }}
            size="small"
            value={filter.title}
            onChange={(value: string) => handleChange('title', value)}
          >
            <Option value="none" >ทั้งหมด</Option>
            {
              titles
                .map((title, i) =>
                {
                  return (
                    <Option
                      key={i}
                      value={title}
                    >
                      {title}
                    </Option>
                  )
                })
            }
          </Select>
        </Field>
      }

      <Field>
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
      </Field> */}

      <Flexbox />
    </Footer>
  )
}

export default Comp