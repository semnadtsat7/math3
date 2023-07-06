import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';

import * as Api from '../../../../utils/QueryAPI';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

export type ListenSummaryOptions =
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
    type: string;
    title: string;
    index: number;
    metrics: Metrics;
  }

export type Total = 
  {
    metrics: Metrics;
  }

export type ListenProgressResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    sheets: Sheet[];
    total: Total;

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-progress-by-sheets';
const VERSION = 1;

const DEFAULT_METRICS: Metrics = 
{
  pass: 0,
  quiz: 0,
};

function useHook (options: ListenSummaryOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [view, setView] = useState<ListenProgressResult>(
    {
      cacheID: '',

      fetching: 'full',

      sheets: [],
      total:
      {
        metrics: DEFAULT_METRICS,
      },

      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !groupID || !version.global || !version.space)
    {
      return;
    }

    if (groupID === 'null')
    {
      return;
    }

    const cacheID = KEY + '-' + spaceID + '-' + groupID + '-' + VERSION;
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
        name: 'group-dashboard-progress-by-sheets',
        data: { spaceID, groupID },
      };

      const { sheets, total } = await Api.exec('page_v2', payload);
      const newView: ListenProgressResult =
      {
        cacheID,

        fetching: 'none',
        version,

        sheets,
        total,
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

  useEffect(handleDownload, [version, spaceID, groupID]);

  return {
    view,
  };
}

export default useHook;