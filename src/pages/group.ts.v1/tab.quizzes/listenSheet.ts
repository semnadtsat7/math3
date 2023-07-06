import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';

import ObjectUtil from '../../../utils/Object';

import * as Api from '../../../utils/QueryAPI';

import * as Filter from './utils/Filter';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../../root';
import { ListenVersionResult } from '../../../hooks/listenVersion';

export type ListenSheetOptions =
  {
    // spaceID: string;
    groupID: string;
  }

export type Metrics = 
{
  play: number;
  pass: number;
  hint: number;
  help: number;
  best: number;
  student: number;

  // DEPRECATED
  // scoreAvg: number;
  //

  usageAvg: number;
}

export type Sheet = 
  {
    _id: string;
    title: string;
  }

export type Quiz = 
  {
    active: boolean;

    _id: string;
    title: string;
    level: string;
    order: number;
    scale: string;
    purpose: string;
    indicator: string;

    metrics: Metrics;
  }

export type Level = 
  {
    _id: string;
    name: string;
  }

export type Play = 
  {
    _id: string;
    name: string;
  }

export type ListenSheetResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    activeAll: boolean;
    quizzes: Quiz[];

    sheets: Sheet[];
    titles: string[];
    levels: Level[];
    plays: Play[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-quizzes';
const VERSION = 4;

function useHook (options: ListenSheetOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [filter, setFilter] = useState(Filter.load());
  const [sort, setSort] = useState(Sorter.load());
  const [time, setTime] = useState(-1);

  const [view, setView] = useState<ListenSheetResult>(
    {
      cacheID: '',

      fetching: 'full',
      activeAll: false,

      sheets: [],
      titles: [],
      levels: [],
      plays: [],

      quizzes: [],
      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !groupID || !version.global || !version.space || time < 1)
    {
      return;
    }

    if (groupID === 'null')
    {
      return;
    }

    let filterID = encodeURIComponent(toJSON(filter));
    let cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;
    
    const cached = await Local.getItem<ListenSheetResult>(cacheID);

    if (cached)
    {
      const { quizzes, ...rest } = cached;
      const sorteds = Sorter.sort(quizzes, sort);

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
        name: 'group-quizzes',
        data: { spaceID, groupID, filter },
      };

      const { activeAll, quizzes, dropdown, filter: newFilter } = await Api.exec('page_v2', payload);
      const { sheets, titles, levels, plays } = dropdown;

      filterID = encodeURIComponent(toJSON(newFilter));
      cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

      const newView: ListenSheetResult =
      {
        cacheID,

        fetching: 'none',
        version,
        
        activeAll,
        quizzes,

        sheets,
        titles,
        levels,
        plays,
      };

      console.log(newView);

      if (ObjectUtil.changeds(filter, newFilter).length > 0)
      {
        Filter.set(newFilter);
        setFilter(newFilter);
      }

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

  function handleFilter (newFilter: Filter.Filter)
  {
    if (ObjectUtil.changeds(filter, newFilter).length > 0)
    {
      if (filter.sheetID !== newFilter.sheetID)
      {
        newFilter.title = 'none';
      }

      Filter.set(newFilter);

      setFilter(newFilter);
      setTime(new Date().getTime());
    }
  }

  function handleSort (orderBy: string, order: string)
  {
    if (orderBy !== sort.orderBy || order !== sort.order)
    {
      Sorter.set(orderBy, order);

      setSort({ orderBy, order });
      setTime(new Date().getTime());
    }
  }

  function handleSpaceChange ()
  {
    // setFilter(Filter.load());
    setTime(new Date().getTime());
  }

  useEffect(handleDownload, [version, time]);
  useEffect(handleSpaceChange, [spaceID, groupID]);

  return {
    view,

    filter,
    sort,

    setFilter: handleFilter,
    setSort: handleSort,
  };
}

export default useHook;