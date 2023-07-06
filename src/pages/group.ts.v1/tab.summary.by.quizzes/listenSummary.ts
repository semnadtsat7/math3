import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import ObjectUtil from '../../../utils/Object';

import * as Api from '../../../utils/QueryAPI';

import * as Filter from './utils/Filter';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../../root';
import { ListenVersionResult } from '../../../hooks/listenVersion';

export type ListenSummaryOptions =
  {
    // spaceID: string;
    groupID: string;
    sheetID: string;
    title: string;
  }

export type Metrics = 
  {
    best: number;
    play: number;
    playDistinct: number;
    hint: number;
    help: number;
    usageAvg: number;
  }

export type Sheet = 
  {
    // _id: string;
    title: string;
  };

export type Quiz = 
  {
    _id: string;
    title: string;
    level: string;
    order: number;
    updatedAt?: number;
    bestAt?: number;
    metrics: Metrics;
  }

export type Level = 
  {
    _id: string;
    name: string;
  }

export type Total = 
  {
    student: number;
  }

export type ListenSummaryResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    sheet: Sheet;
    quizzes: Quiz[];

    total: Total;

    titles: string[];
    levels: Level[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-summary-by-quizzes';
const VERSION = 4;

function useHook (options: ListenSummaryOptions)
{
  const { groupID, sheetID, title } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [filter, setFilter] = useState(Filter.load(title));
  const [sort, setSort] = useState(Sorter.load());

  const [view, setView] = useState<ListenSummaryResult>(
    {
      cacheID: '',

      fetching: 'full',
      sheet:
      {
        title: '',
      },

      total:
      {
        student: 0,
      },

      titles: [],
      levels: [],

      quizzes: [],
      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !groupID || !sheetID || !version.global || !version.space)
    {
      return;
    }

    if (groupID === 'null')
    {
      return;
    }

    if (sheetID === 'null')
    {
      return;
    }

    const cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + sheetID + '-' + VERSION;
    const cached = await Local.getItem<ListenSummaryResult>(cacheID);

    if (cached)
    {
      const { quizzes, ...rest } = cached;

      const filtereds = Filter.exec(cached.quizzes, filter);
      const sorteds = Sorter.sort(filtereds, sort, rest.total);

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
        name: 'group-summary-by-quizzes',
        data: { spaceID, groupID, sheetID },
      };

      const { sheet, quizzes, dropdown, total } = await Api.exec('page_v2', payload);
      const { titles, levels } = dropdown;

      const newView: ListenSummaryResult =
      {
        cacheID,

        fetching: 'none',
        version,
        
        sheet,
        quizzes,

        total,

        titles,
        levels,
      };

      // setView(newView);

      if (view.cacheID === newView.cacheID)
      {
        await Local.removeItem(view.cacheID);
      }
      
      await Local.setItem(newView.cacheID, newView);

      const filtereds = Filter.exec(quizzes, filter);
      const sorteds = Sorter.sort(filtereds, sort, total);

      // setView(newView);
      setView({ ...newView, quizzes: sorteds });
    }
  }

  function handleDownload ()
  {
    handleDownloadAsync().then();
  }

  function handleFilter (newFilter: Filter.Filter)
  {
    if (ObjectUtil.changeds(filter, newFilter).length > 0)
    {
      Filter.set(newFilter);//, sheetID);
      setFilter(newFilter);
    }
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
    setFilter(Filter.load(title));
  }

  useEffect(handleDownload, [version, filter, sort]);
  useEffect(handleSpaceChange, [spaceID, groupID, sheetID, title]);

  return {
    view,

    filter,
    sort,

    setFilter: handleFilter,
    setSort: handleSort,
  };
}

export default useHook;