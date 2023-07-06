import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Local from 'localforage';
import toJSON from 'json-stable-stringify';

import ObjectUtil from '../../../../utils/Object';

import * as Api from '../../../../utils/QueryAPI';

import * as Filter from './utils/Filter';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

export type ListenStudentsOptions =
  {
    groupID: string;
  }

export type Total = 
  {
    active: number;
    student: number;
  }

export type ListenStudentsResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';
    
    total: Total;

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-student-actives';
const VERSION = 1;

function getStartAt (range: string)
{
  let startAt = moment().startOf('day');

  if (range === '7D')
  {
    startAt = startAt.subtract(6, 'day');
  }
  else if (range === '30D')
  {
    startAt = startAt.subtract(29, 'day');
  }

  return startAt.valueOf();
}

function useHook (options: ListenStudentsOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [filter, setFilter] = useState(Filter.load());
  const [time, setTime] = useState(-1);

  const [view, setView] = useState<ListenStudentsResult>(
    {
      cacheID: '',

      fetching: 'full',
      total:
      {
        active: 0,
        student: 0,
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

    const startAt = getStartAt(filter.range);

    let filterID = encodeURIComponent(toJSON({ startAt }));
    let cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

    const cached = await Local.getItem<ListenStudentsResult>(cacheID);

    if (cached)
    {
      setView(cached);
    }
    // else if (view.fetching === 'none')
    // {
    //   setView({ ...view, fetching: 'full' });
    // }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      if (!cached)
      {
        setView({ ...view, fetching: 'full' });
      }
      else
      {
        setView({ ...view, fetching: 'partial' });
      }

      const payload = 
      {
        name: 'group-dashboard-student-actives',
        data: { spaceID, groupID, filter: { startAt } },
      };

      const data = await Api.exec('page_v2', payload);
      const { total } = data;

      cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION + '-' + filterID;

      const newView: ListenStudentsResult =
      {
        cacheID,

        fetching: 'none',
        total,

        version,
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

  function handleFilter (newFilter: Filter.Filter)
  {
    if (ObjectUtil.changeds(filter, newFilter).length > 0)
    {
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