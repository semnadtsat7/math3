import React, { useState, useMemo } from 'react';

import Pagination from '../progress-by-sheets/BySheets/Pagination';

import { ListenSheetsResult } from './listenSheets';

import Loading from '../student-inactives/Loading';
import Item from './Sheet';

interface Props
{
  groupID: string;

  view: ListenSheetsResult;
  name: string;
}

function parse (view: ListenSheetsResult, page: number)
{
  if (view.fetching === 'full')
  {
    return {
      sheets: [],
      pageCount: 1,
    };
  }

  const items = view.sheets;
  const limit = 3;
  const offset = (page - 1) * limit;

  const pageCount = Math.ceil(items.length / limit);

  return {
    pageCount,
    sheets: items.slice(offset, offset + limit),
  }
}

const Comp: React.FC<Props> = (
  {
    groupID,
    
    view,
    name,
  }
) =>
{
  const [page, setPage] = useState(1);
  const { sheets, pageCount } = useMemo(() => parse(view, page), [view, page]);

  function handlePrev ()
  {
    setPage(page - 1);
  }

  function handleNext ()
  {
    setPage(page + 1);
  }

  return (
    <>
      {
        view.fetching === 'full' ?
          <Loading>
            <p>
              กำลังโหลด ...
            </p>
          </Loading>
          :
          <div>
            {
              sheets.map(
                sheet =>
                {
                  return (
                    <Item
                      key={sheet._id}
                      name={name}
                      sheet={sheet}
                      groupID={groupID}
                    />
                  );
                }
              )
            }
          </div>
      }

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
  );
}

export default Comp;