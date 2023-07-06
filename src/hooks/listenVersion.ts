import { useMemo } from 'react';

import listenGlobalVersion from './listenGlobalVersion';
import listenSpaceVersion from './listenSpaceVersion';

export type ListenVersionOptions =
  {
    spaceID: string;
  }

export type ListenVersionResult = 
  {
    global?: string;
    space?: string;
  }

function useHook (options: ListenVersionOptions)
{
  const gVersion = listenGlobalVersion();
  const sVersion = listenSpaceVersion(options);

  const version = useMemo<ListenVersionResult>(
    () => {
      return {
        global: gVersion,
        space: sVersion,
      } 
    },
    [ gVersion, sVersion ]
  );

  return version;
}

export default useHook;