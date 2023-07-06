import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Local from 'localforage';

import * as Api from '../../utils/QueryAPI';

import { RootContext } from '../../root';
import { ListenVersionResult } from '../../hooks/listenVersion';

export type ListenGroupOptions =
  {
    // spaceID: string;
    groupID: string;
  }

export type ListenGroupResult =
  {
    cacheID: string;

    fetching: 'full' | 'partial' | 'none';

    _id: string;
    name: string;
    students: string[];

    version: ListenVersionResult;
  }

const KEY = 'view-group';
const VERSION = 2;

function useHook (options: ListenGroupOptions)
{
  const history = useHistory();

  const { groupID } = options;
  const { spaceID, version } = useContext(RootContext);

  // const version = listenVersion(options);

  const [view, setView] = useState<ListenGroupResult>(
    {
      cacheID: '',

      fetching: 'full',

      _id: '',
      name: 'กำลังโหลด...',
      students: [],

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
    const cached = await Local.getItem<ListenGroupResult>(cacheID);

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
        name: 'group',
        data: { spaceID, groupID },
      };

      try
      {
        const newGroup = await Api.exec('page_v2', payload);
        const newView: ListenGroupResult =
        {
          cacheID,

          fetching: 'none',
          version,

          ...newGroup,
        };

        setView(newView);

        if (view.cacheID === newView.cacheID)
        {
          await Local.removeItem(view.cacheID);
        }
        
        await Local.setItem(newView.cacheID, newView);
      }
      catch
      {
        history.replace('/groups');
      }
    }
  }

  function handleDownload ()
  {
    handleDownloadAsync().then();
  }

  useEffect(handleDownload, [version, spaceID, groupID]);

  return view;
}

export default useHook;