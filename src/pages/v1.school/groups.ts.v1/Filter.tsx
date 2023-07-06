import React from 'react';
// import moment from 'moment';
import styled from 'styled-components';

// import
// {
//   // DatePicker,
//   Select,
// } from 'antd'

// import
// {
//   Paper,
// } from '@material-ui/core'

// import { RangePickerValue } from 'antd/lib/date-picker/interface';

import Dropdown from '../../../components/Table/Filter/Dropdown';
import RangePicker from '../../../components/Table/Filter/RangePicker';

import Flexbox from '../../../components/Flexbox'
import Footer from '../../../components/Table/Footer';
// import DateUtil from '../../utils/DateTime'

import { Sheet } from './listenGroups';
import { Filter } from './utils/Filter';

// const { RangePicker } = DatePicker;
// const { Option } = Select;

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

type Props =
  {
    filter: Filter;

    sheets: Sheet[];
    titles?: string[];

    onChange (filter: Filter): void;

    extra?: any;
  }

const Comp: React.FC<Props> = (
  {
    filter,

    sheets,
    titles,

    onChange,

    extra,
  }
) =>
{
  // const startAt = useMemo(() => moment(filter.startAt), [filter.startAt]);
  // const endAt = useMemo(() => moment(filter.endAt), [filter.endAt]);

  // function handleRangeChange ([_startAt, _endAt]: RangePickerValue)
  // {
  //   let startAt = _startAt ? _startAt.startOf('day').valueOf() : undefined;
  //   let endAt = _endAt ? _endAt.endOf('day').valueOf() : undefined;

  //   const m01 = 60000;
  //   const max = moment().endOf('day');

  //   if (!endAt || moment(endAt) > max)
  //   {
  //     endAt = max.valueOf();
  //   }

  //   const min = moment(endAt).subtract(1, 'year').startOf('day');

  //   if (!startAt || moment(startAt) < min)
  //   {
  //     startAt = min.valueOf();
  //   }

  //   if (startAt)
  //   {
  //     startAt = startAt - (startAt % m01);
  //   }

  //   if (endAt)
  //   {
  //     endAt = endAt - (endAt % m01);
  //   }

  //   onChange({ ...filter, startAt, endAt });
  // }

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

      <RangePicker 
        label="ช่วงเวลา"
        value={[ filter.startAt, filter.endAt ]}
        onChange={([ startAt, endAt ]) => onChange({ ...filter, startAt, endAt })}
      />

{/* 
      <Field>
        <Label>ช่วงเวลา</Label>
        <RangePicker
          placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
          format="DD/MM/YYYY"
          size="small"
          showTime={false}
          style={{ width: 240 }}
          autoFocus={false}
          value={[startAt, endAt]}
          onChange={handleRangeChange}
          ranges={
            {
              'วันนี้': [moment().startOf('day'), moment().startOf('day')],
              '7 วันล่าสุด': [moment().subtract('days', 7).startOf('day'), moment().subtract('days', 1).endOf('day')],
              '30 วันล่าสุด': [moment().subtract('days', 30).startOf('day'), moment().subtract('days', 1).endOf('day')],
              'เดือนนี้': [moment().startOf('month'), moment().endOf('month')],
            }
          }
          disabledDate={
            (current) =>
            {
              const now = moment();
              return !current || current > now.endOf('day') || current < now.subtract(1, 'year').startOf('day');
            }
          }
        />
      </Field> */}

      {
        sheets.length > 0 &&
        <Dropdown 
          label="บทเรียน"
          value={filter.sheetID}
          onChange={value => handleChange('sheetID', value)}
          items={
            [{ value: 'none', label: 'ทั้งหมด' }].concat(
              sheets.map(e => { return { value: e._id, label: e.title } })
            )
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
            <Option value="none" >ทั้งหมด</Option>
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
      } */}

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
        // titles && titles.length > 0 &&
        // <Field>
        //   <Label>บทเรียนย่อย</Label>
        //   <Select
        //     dropdownMatchSelectWidth={false}
        //     style={{ width: 160 }}
        //     size="small"
        //     value={filter.title}
        //     onChange={(value: string) => handleChange('title', value)}
        //   >
        //     <Option value="none" >ทั้งหมด</Option>
        //     {
        //       titles
        //         .map((title) =>
        //         {
        //           return (
        //             <Option
        //               key={title}
        //               value={title}
        //             >
        //               {title}
        //             </Option>
        //           )
        //         })
        //     }
        //   </Select>
        // </Field>
      }

      <Flexbox />
      
    </Footer>
  )
}

export default Comp