import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Local from 'localforage';

import * as Api from '../../utils/QueryAPI';

import { RootContext } from '../../root';
import { ListenVersionResult } from '../../hooks/listenVersion';

export type ListenStudentOptions =
  {
    // spaceID: string;
    studentID: string;
  }

export type ListenStudentResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    _id: string;
    name: string;
    coin: number;
    customId?: string;
    // lastSignedInAt?: number;

    version: ListenVersionResult;
  }

const KEY = 'view-student';
const VERSION = 2;

function useHook (options: ListenStudentOptions)
{
  const history = useHistory();

  const { studentID } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [view, setView] = useState<ListenStudentResult>(
    {
      cacheID: '',

      fetching: 'full',

      _id: '',
      name: 'กำลังโหลด...',
      coin: 0,

      version: {},
    }
  );

  async function handleDownloadAsync ()
  {
    if (!spaceID || !studentID || !version.global || !version.space)
    {
      return;
    }

    if (studentID === 'null')
    {
      return;
    }

    const cacheID = KEY + '-' + spaceID + '-' + studentID + '-' + VERSION;
    const cached = await Local.getItem<ListenStudentResult>(cacheID);

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
        name: 'student',
        data: { spaceID, studentID },
      };

      try
      {
        const newStudent = await Api.exec('page_v2', payload);
        const newView: ListenStudentResult =
        {
          cacheID,

          fetching: 'none',
          version,

          ...newStudent,
        };

        if (typeof newView.name !== 'string')
        {
          history.replace('/students');
        }
        else
        {
          setView(newView);

          if (view.cacheID === newView.cacheID)
          {
            await Local.removeItem(view.cacheID);
          }
          
          await Local.setItem(newView.cacheID, newView);
        }
      }
      catch
      {
        history.replace('/students');
      }
    }
  }

  function handleDownload ()
  {
    handleDownloadAsync().then();
  }

  useEffect(handleDownload, [version, spaceID, studentID]);

  return view;
}

export default useHook;