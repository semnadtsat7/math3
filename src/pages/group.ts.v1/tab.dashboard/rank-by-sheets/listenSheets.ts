import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';

import * as Api from '../../../../utils/QueryAPI';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

export type ListenSheetsOptions =
  {
    groupID: string;
  }

export type Metrics = 
  {
    best: number;
  }

export type Student = 
  {
    _id: string;
    name: string;
    metrics: Metrics;
  }

type Rank = 
  {
    [key: string]: Student[];
  }

export type Sheet = 
  {
    _id: string;
    type: string;
    index: number;
    title: string;
    students: Rank;
  }

export type ListenSheetsResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';
    sheets: Sheet[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-rank-by-sheets';
const VERSION = 1;

function useHook (options: ListenSheetsOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [time, setTime] = useState(-1);
  const [view, setView] = useState<ListenSheetsResult>(
    {
      cacheID: '',

      fetching: 'full',
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

    const cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION;
    const cached = await Local.getItem<ListenSheetsResult>(cacheID);

    if (cached)
    {
      setView(cached);
    }

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
        name: 'group-dashboard-rank-by-sheets',
        data: { spaceID, groupID },
      };

      const data = await Api.exec('page_v2', payload);
      const { sheets } = data;

      const newView: ListenSheetsResult =
      {
        cacheID,

        fetching: 'none',
        sheets,

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

  function handleSpaceChange ()
  {
    setTime(new Date().getTime());
  }

  useEffect(handleDownload, [version, time]);
  useEffect(handleSpaceChange, [spaceID, groupID]);

  return {
    view,
  };
}

export default useHook;