import { useState, useEffect } from 'react';
import Firebase from '../utils/Firebase';

const KEY = 'version-space';
const VERSION = 1;

export type ListenSpaceVersionOptions =
  {
    spaceID: string;
  }

function useHook (options: ListenSpaceVersionOptions)
{
  const { spaceID } = options;
  const [version, setVersion] = useState<string>();

  function handleVersion ()
  {
    const cacheID = KEY + '-' + spaceID + '-' + VERSION;
    const cached = window.localStorage.getItem(cacheID);

    if (cached)
    {
      setVersion(cached);
    }
    
    const cfs = Firebase.firestore();
    const ref = cfs.doc(`teachers/${spaceID}`);

    const unsubscribe = ref.onSnapshot(
      doc =>
      {
        if (doc.exists)
        {
          const version = (doc.get('version')?.data ?? '0') as string;

          window.localStorage.setItem(cacheID, version);
          setVersion(version);
        }
        else
        {
          setVersion('0');
        }
      }
    );

    return function ()
    {
      unsubscribe();
    }
  }

  useEffect(handleVersion, [spaceID]);

  return version;
}

export default useHook;