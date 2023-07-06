import { useState, useEffect, useContext } from 'react';
import Local from 'localforage';

import * as Api from '../../../utils/QueryAPI';
import * as Sorter from './utils/Sorter';

import { RootContext } from '../../../root';
import { ListenVersionResult } from '../../../hooks/listenVersion';

export type ListenSummaryOptions =
  {
    // spaceID: string;
    groupID: string;
  }

export type Metrics = 
  {
    best: number;
    play: number;
    pass: number;
    quiz: number;
    hint: number;
    help: number;
    usageAvg: number;
  }

export type Sheet = 
  {
    _id: string;
    type: string;
    title: string;
    index: number;
    updatedAt?: number;
    metrics: Metrics;
  }

export type Total = 
  {
    updatedAt?: number;
    metrics: Metrics;
  }

export type ListenSummaryResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    sheets: Sheet[];
    total: Total;

    version: ListenVersionResult;
  }

const KEY = 'view-group-summary-by-sheets';
const VERSION = 2;

const DEFAULT_METRICS: Metrics = 
{
  best: 0,
  play: 0,
  pass: 0,
  quiz: 0,
  hint: 0,
  help: 0,
  usageAvg: 0,
};

function useHook (options: ListenSummaryOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [sort, setSort] = useState(Sorter.load());
  const [view, setView] = useState<ListenSummaryResult>(
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
    const cached = await Local.getItem<ListenSummaryResult>(cacheID);

    if (cached)
    {
      const { sheets, ...rest } = cached;
      const sorteds = Sorter.sort(cached.sheets, sort);

      setView({ ...rest, sheets: sorteds });
    }
    else if (view.fetching === 'none')
    {
      setView({ ...view, fetching: 'partial' });
    }

    if (!cached || cached.version.global !== version.global || cached.version.space !== version.space)
    {
      const payload = 
      {
        name: 'group-summary-by-sheets',
        data: { spaceID, groupID },
      };

      const { sheets, total } = await Api.exec('page_v2', payload);
      const newView: ListenSummaryResult =
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

  function handleSort (orderBy: string, order: string)
  {
    if (orderBy !== sort.orderBy || order !== sort.order)
    {
      Sorter.set(orderBy, order);
      setSort({ orderBy, order });
    }
  }

  useEffect(handleDownload, [version, spaceID, groupID, sort]);

  return {
    view,
    sort,
    setSort: handleSort,
  };
}

export default useHook;