import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';

import ObjectUtil from '../../../../utils/Object';

import * as Api from '../../../../utils/QueryAPI';

import * as Filter from './utils/Filter';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

// interface KV
// {
//   [key: string]: number;
// }

export type ListenSummaryOptions =
  {
    groupID: string;
  }

export type Sheet = 
  {
    _id: string;
    type: string;
    title: string;
  }

export type Metrics = 
  {
    best: number;
    value: number;
  };

export type Total = 
  {
    student: number;
    sheet: number;
    quiz: number;
  }

export type Student = 
  {
    _id: string;
    name: string;
    metrics: Metrics;
  }

export type ListenSummaryResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    students: Student[];
    total: Total;

    min: Metrics;
    max: Metrics;

    sheets: Sheet[];
    titles?: string[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-scatter';
const VERSION = 1;

function useHook (options: ListenSummaryOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [filter, setFilter] = useState(Filter.load());
  const [time, setTime] = useState(-1);

  const [view, setView] = useState<ListenSummaryResult>(
    {
      cacheID: '',

      fetching: 'full',

      students: [],

      min:
      {
        best: 0,
        value: 0,
      },

      max:
      {
        best: 1,
        value: 1,
      },

      total: 
      {
        student: 0,
        sheet: 0,
        quiz: 0,
      },

      sheets: [],

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

    const cached = await Local.getItem<ListenSummaryResult>(cacheID);

    if (cached)
    {
      setView(cached);
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'partial' });
    }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      const payload = 
      {
        name: 'group-dashboard-scatter',
        data: { spaceID, groupID, filter },
      };

      const { students, total, min, max, dropdown, filter: newFilter } = await Api.exec('page_v2', payload);
      const { sheets, titles } = dropdown;

      filterID = encodeURIComponent(toJSON(newFilter));
      cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

      const newView: ListenSummaryResult =
      {
        cacheID,

        fetching: 'none',
        version,

        students,
        total,

        min,
        max,

        sheets,
        titles,
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

  function handleSpaceChange ()
  {
    setTime(new Date().getTime());
  }

  useEffect(handleDownload, [version, time]);
  useEffect(handleSpaceChange, [spaceID, groupID]);

  return {
    view,
    filter,

    setFilter: handleFilter,
  };
}

export default useHook;