import React from 'react';
import querystring from 'querystring';
import { useHistory } from 'react-router-dom';

import * as StudentFilter from '../../tab.students/utils/Filter';
import * as StudentSorter from '../../tab.students/utils/Sorter';

import NumberUtil from '../../../../utils/NumberTS';

import { Sheet } from './listenSheets';

import ItemGroup from './ItemGroup';
import Item from './Item';

import ItemNumber from './Item.Number';
import ItemName from './Item.Name';
import ItemScore from './Item.Score';

interface Props
{
  groupID: string;

  sheet: Sheet;
  name: string;
}

const Comp: React.FC<Props> = (
  {
    groupID,

    sheet,
    name,
  }
) =>
{
  const history = useHistory();

  const location = history.location;
  const pathname = location.pathname;

  const q = querystring.parse(location.search.slice(1));
  const qs = querystring.stringify({ ...q, tab: 'students' });

  const sheetHref = pathname + '?' + qs;

  const items = [];
  const students = sheet.students[name];

  for (let i = 0; i < 3; i++)
  {
    const n = i + 1;

    if (i < students.length)
    {
      const studentHref = `/students/${students[i]._id}?sheetID=${sheet._id}&group=${groupID}`;

      items.push(
        <Item 
          key={`${sheet._id}-${name}-${n}`} 
          href={studentHref}
          onClick={e =>
          {
            e.preventDefault();
            history.push(studentHref);
          }}
        >
          <ItemNumber>
            {n}
          </ItemNumber>
          <ItemName>
            {students[i].name}
          </ItemName>
          <ItemScore>
            {NumberUtil.prettify(students[i]?.metrics?.best)}
            <small>คะแนน</small>
          </ItemScore>
        </Item>
      );
    }
    else
    {
      items.push(
        <Item key={`${sheet._id}-${name}-${n}`} >
          <ItemNumber>
            {n}
          </ItemNumber>
          <ItemName>
            -
          </ItemName>
        </Item>
      );
    }
  }

  return (
    <>
      <ItemGroup
        href={sheetHref}
        onClick={e =>
        {
          e.preventDefault();

          const filter = StudentFilter.load();
                
          filter.sheetID = sheet._id;
          filter.quizID = 'none';
          filter.title = 'none';

          StudentFilter.set(filter);
          StudentSorter.set('best', 'desc');

          history.push(sheetHref);
        }}
      >
        {sheet.title}
      </ItemGroup>
      {items}
    </>
  );
}

export default Comp;