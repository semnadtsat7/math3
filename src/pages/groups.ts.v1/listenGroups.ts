import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';

import ObjectUtil from '../../utils/Object';

import * as Api from '../../utils/QueryAPI';

import * as Filter from './utils/Filter';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../root';
import { ListenVersionResult } from '../../hooks/listenVersion';

// export type ListenStudentsOptions =
//   {
//     spaceID: string;
//   }

export type Sheet = 
  {
    _id: string;
    type: string;
    title: string;
  }

export type Group = 
  {
    _id: string;
    name: string;

    metrics: 
    {
      student: number;
      
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
    group: number;
    quiz: number;
  }

export type ListenStudentsResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    groups: Group[];
    sheets: Sheet[];
    titles?: string[];

    metrics: Total;

    version: ListenVersionResult;
  }

const KEY = 'view-groups';
const VERSION = 3;

function useHook ()// (options: ListenStudentsOptions)
{
  const { spaceID, version } = useContext(RootContext);

  // const { spaceID } = options;
  // const version = listenVersion(options);

  const [filter, setFilter] = useState(Filter.load());
  const [sort, setSort] = useState(Sorter.load());
  const [time, setTime] = useState(-1);

  const [view, setView] = useState<ListenStudentsResult>(
    {
      cacheID: '',

      fetching: 'full',

      groups: [],
      sheets: [],

      metrics:
      {
        group: 0,
        quiz: 0,
      },

      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !version.global || !version.space || time < 1)
    {
      return;
    }

    let filterID = encodeURIComponent(toJSON(filter));
    let cacheID = KEY + '-' + spaceID + '-' + VERSION + '-' + filterID;

    const cached = await Local.getItem<ListenStudentsResult>(cacheID);

    if (cached)
    {
      const { groups, ...rest } = cached;
      const sorteds = Sorter.sort(cached.groups, sort, rest.metrics);

      setView({ ...rest, groups: sorteds });
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'partial' });
    }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      const options = { accurate: false };
      
      const payload = 
      {
        name: 'groups',
        data: { spaceID, filter, options },
      };

      const data = await Api.exec('page_v2', payload);

      const { groups, dropdown, metrics, filter: newFilter } = data;
      const { sheets, titles } = dropdown;

      filterID = encodeURIComponent(toJSON(newFilter));
      cacheID = KEY + '-' + spaceID + '-' + VERSION + '-' + filterID;
      
      const newView: ListenStudentsResult =
      {
        cacheID,

        fetching: 'none',
        groups: Sorter.sort(groups, sort, metrics),
        sheets,
        titles,
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
  useEffect(handleSpaceChange, [spaceID]);

  return {
    view,
    
    filter,
    sort,

    setFilter: handleFilter,
    setSort: handleSort,
  };
}

export default useHook;