import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';
import ObjectUtil from '../../../../utils/Object';

import * as Api from '../../../../utils/QueryAPI';

import * as Filter from './utils/Filter';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

export type ListenProgressOptions =
  {
    groupID: string;
  }

export type Metrics = 
  {
    pass: number;
    quiz: number;
  }

export type Sheet = 
  {
    _id: string;
    title: string;
  };

export type Quiz = 
  {
    title: string;
    metrics: Metrics;
  }

export type ListenProgressResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    quizzes: Quiz[];
    sheets: Sheet[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-progress-by-quizzes';
const VERSION = 2;

function useHook (options: ListenProgressOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [filter, setFilter] = useState(Filter.load());
  const [time, setTime] = useState(-1);
  
  const [view, setView] = useState<ListenProgressResult>(
    {
      cacheID: '',

      fetching: 'full',

      quizzes: [],
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
    
    const cached = await Local.getItem<ListenProgressResult>(cacheID);

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
        name: 'group-dashboard-progress-by-quizzes',
        data: { spaceID, groupID, filter },
      };

      const { quizzes, dropdown, filter: newFilter } = await Api.exec('page_v2', payload);
      const { sheets } = dropdown;

      filterID = encodeURIComponent(toJSON(newFilter));
      cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

      const newView: ListenProgressResult =
      {
        cacheID,

        fetching: 'none',
        version,
        
        quizzes,
        sheets,
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
      Filter.set(newFilter);//, sheetID);
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