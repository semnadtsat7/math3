import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Local from 'localforage';

import * as Api from '../../../../utils/QueryAPI';

import { RootContext } from '../../../../root';
import { ListenVersionResult } from '../../../../hooks/listenVersion';

export type ListenStudentsOptions =
  {
    groupID: string;
  }

export type Student = 
  {
    _id: string;
    name: string;
  }

export type ListenStudentsResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';
    students: Student[];

    version: ListenVersionResult;
  }

const KEY = 'view-group-dashboard-student-inactives';
const VERSION = 1;

function useHook (options: ListenStudentsOptions)
{
  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  const [time, setTime] = useState(-1);
  const [view, setView] = useState<ListenStudentsResult>(
    {
      cacheID: '',

      fetching: 'full',
      students: [],

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
    const cached = await Local.getItem<ListenStudentsResult>(cacheID);

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

      const startAt = moment().subtract(6, 'day').valueOf();

      const payload = 
      {
        name: 'group-dashboard-student-inactives',
        data: { spaceID, groupID, filter: { startAt } },
      };

      const { students } = await Api.exec('page_v2', payload);

      console.log(students);

      const newView: ListenStudentsResult =
      {
        cacheID,

        fetching: 'none',
        students,

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