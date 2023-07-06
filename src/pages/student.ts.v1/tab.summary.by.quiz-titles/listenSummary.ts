import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';

import * as Api from '../../../utils/QueryAPI';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../../root';
import { ListenVersionResult } from '../../../hooks/listenVersion';

export type ListenSummaryOptions =
  {
    // spaceID: string;
    studentID: string;
    sheetID: string;
  }

export type Metrics = 
  {
    best: number;
    play: number;
    pass: number;
    hint: number;
    help: number;
    quiz: number;
    usageAvg: number;
  }

export type Sheet = 
  {
    // _id: string;
    title: string;
  };

export type Quiz = 
  {
    title: string;
    order: number;
    orders: number[][];
    updatedAt?: number;
    metrics: Metrics;
  }

export type ListenSummaryResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    sheet: Sheet;
    quizzes: Quiz[];

    version: ListenVersionResult;
  }

const KEY = 'view-student-summary-by-quiz-titles';
const VERSION = 2;

function useHook (options: ListenSummaryOptions)
{
  const { studentID, sheetID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [sort, setSort] = useState(Sorter.load());

  const [view, setView] = useState<ListenSummaryResult>(
    {
      cacheID: '',

      fetching: 'full',
      sheet:
      {
        title: '',
      },

      quizzes: [],
      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !studentID || !sheetID || !version.global || !version.space)
    {
      return;
    }

    if (studentID === 'null')
    {
      return;
    }

    if (sheetID === 'null')
    {
      return;
    }

    const cacheID = KEY + '-' + spaceID + '-' + studentID + '-' + sheetID + '-' + VERSION;
    const cached = await Local.getItem<ListenSummaryResult>(cacheID);

    if (cached)
    {
      const { quizzes, ...rest } = cached;
      const sorteds = Sorter.sort(cached.quizzes, sort);

      setView({ ...rest, quizzes: sorteds });
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'partial' });
    }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      const payload = 
      {
        name: 'student-summary-by-quiz-titles',
        data: { spaceID, studentID, sheetID },
      };

      const { sheet, quizzes } = await Api.exec('page_v2', payload);

      const newView: ListenSummaryResult =
      {
        cacheID,

        fetching: 'none',
        version,
        
        sheet,
        quizzes,
      };

      setView(newView);

      if (view.cacheID === newView.cacheID)
      {
        await Local.removeItem(view.cacheID);
      }
      
      await Local.setItem(newView.cacheID, newView);
    }
  }

  function handleDownload ()
  {
    handleDownloadAsync().then();
  }

  function handleSort (orderBy: string, order: string)
  {
    if (orderBy !== sort.orderBy || order !== sort.order)
    {
      Sorter.set(orderBy, order);
      setSort({ orderBy, order });
    }
  }

  function handleSpaceChange ()
  {
    setSort(Sorter.load());
  }

  useEffect(handleDownload, [version, sort]);
  useEffect(handleSpaceChange, [spaceID, studentID, sheetID]);

  return {
    view,

    sort,
    setSort: handleSort,
  };
}

export default useHook;