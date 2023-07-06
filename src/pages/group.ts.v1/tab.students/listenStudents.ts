import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';

import ObjectUtil from '../../../utils/Object';

import * as Api from '../../../utils/QueryAPI';

import * as Filter from './utils/Filter';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../../root';
import { ListenVersionResult } from '../../../hooks/listenVersion';

export type ListenStudentsOptions =
  {
    // spaceID: string;
    groupID: string;
  }

export type Sheet = 
  {
    _id: string;
    type: string;
    title: string;
  }

export type Order = 
  {
    _id: string;
    order: number;
  }

export type Scope = 
  {
    _id: string;
    name: string;
  }

export type Student = 
  {
    _id: string;
    name: string;
    coin: number;
    customId?: string;
    lastSignedInAt?: number;

    active: boolean;

    metrics: 
    {
      best: number;
      play: number;
      pass: number;
      hint: number;
      help: number;
      usageAvg: number;
    };
  }

export type Total =
  {
    student: number;
    sheet: number;
    quiz: number;
  }

export type ListenStudentsResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';
    activeAll: boolean;
    students: Student[];
    scopes: Scope[];
    sheets: Sheet[];
    titles?: string[];
    orders?: Order[];

    metrics: Total;

    version: ListenVersionResult;
  }

const KEY = 'view-students';
const VERSION = 2;

function useHook (options: ListenStudentsOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [filter, setFilter] = useState(Filter.load());
  const [sort, setSort] = useState(Sorter.load());
  const [time, setTime] = useState(-1);

  const [view, setView] = useState<ListenStudentsResult>(
    {
      cacheID: '',

      fetching: 'full',
      activeAll: false,

      students: [],
      scopes: [],
      sheets: [],

      metrics:
      {
        student: 0,
        sheet: 0,
        quiz: 0,
      },

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

    const cached = await Local.getItem<ListenStudentsResult>(cacheID);

    if (cached)
    {
      const { students, ...rest } = cached;
      const sorteds = Sorter.sort(cached.students, sort, rest.metrics);
      // const fetching = cached.version.global !== version.global || cached.version.space !== version.space ? 'partial' : 'none';

      setView({ ...rest, students: sorteds });
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'partial' });
    }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      const payload = 
      {
        name: 'group-students',
        data: { spaceID, groupID, filter },
      };

      const data = await Api.exec('page_v2', payload);

      const { activeAll, students, dropdown, metrics, filter: newFilter } = data;
      const { scopes, sheets, titles, orders } = dropdown;

      filterID = encodeURIComponent(toJSON(newFilter));
      cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

      const newView: ListenStudentsResult =
      {
        cacheID,

        fetching: 'none',
        activeAll,
        
        students: Sorter.sort(students, sort, metrics),
        scopes,
        sheets,
        titles,
        orders,
        metrics,
        version,
      };

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

      if (filter.title !== newFilter.title)
      {
        newFilter.quizID = 'none';
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