import React, { useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Pagination from '../progress-by-sheets/BySheets/Pagination';

import listenInactives, { ListenStudentsResult } from './listenInactives';

import GroupItem from '../GroupItem';
import Card from '../Card';
import Loading from './Loading';
import List from './List';

import Item from './Item';
import ItemNumber from './Item.Number';
import ItemName from './Item.Name';

interface Params
{
  groupId?: string;
}

const LIMIT = 8;

function parse (view: ListenStudentsResult, page: number)
{
  if (view.fetching === 'full')
  {
    return {
      students: [],
      pageCount: 1,
    };
  }

  const items = view.students;
  const limit = LIMIT;
  const offset = (page - 1) * limit;

  const pageCount = Math.ceil(items.length / limit);

  return {
    pageCount,
    students: items.slice(offset, offset + limit),
  }
}

const Comp: React.FC = () =>
{
  const history = useHistory();

  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view } = listenInactives({ groupID });

  const [page, setPage] = useState(1);
  const { students, pageCount } = useMemo(() => parse(view, page), [view, page]);

  function handlePrev ()
  {
    setPage (page - 1);
  }

  function handleNext ()
  {
    setPage (page + 1);
  }

  return (
    <GroupItem 
      // sm="200px"
      // xxl="100%"
    >
      <Card>
        <label>รายชื่อนักเรียนที่ไม่ได้เล่นใน 7 วันล่าสุด</label>

        {
          view.fetching === 'full' ?
          <Loading>
            <p>
              กำลังโหลด ...
            </p>
          </Loading>
          :
          <>
            <List isLoading={view.fetching !== 'none'} >
              {
                students.map(
                  (student, i) =>
                  {
                    const href = `/students/${student._id}?group=${groupID}`;
                    const offset = (page - 1) * LIMIT;
                    const n = (i + 1) + offset;

                    return (
                      <Item 
                        key={student._id}
                        href={href}
                        onClick={e =>
                        {
                          e.preventDefault();
                          history.push(href);
                        }}
                      >
                        <ItemNumber>
                          {n}
                        </ItemNumber>
                        <ItemName>
                          {student.name}
                        </ItemName>
                      </Item>
                    );
                  }
                )
              }
            </List>
            {
              pageCount > 1 &&
              <Pagination 
                disabled={view.fetching !== 'none'}
                page={page}
                pageCount={pageCount}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            }
          </>
        }
      </Card>
    </GroupItem>
  );
}

export default Comp;