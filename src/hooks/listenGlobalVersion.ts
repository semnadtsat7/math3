import { useState, useEffect } from 'react';
import Firebase from '../utils/Firebase';

const KEY = 'version-global';
const VERSION = 1;

function useHook ()
{
  const [version, setVersion] = useState<string>();

  function handleVersionValue (snapshot: Firebase.database.DataSnapshot)
  {
    if (!!snapshot && snapshot.exists())
    {
      const value = snapshot.val();
      const cacheID = KEY + '-' + VERSION;

      window.localStorage.setItem(cacheID, value);

      setVersion(value);
    }
    else
    {
      setVersion('0');
    }
  }

  function handleVersion ()
  {
    const cacheID = KEY + '-' + VERSION;
    const cached = window.localStorage.getItem(cacheID);

    if (cached)
    {
      setVersion(cached);
    }
    
    const rdb = Firebase.database();
    const ref = rdb.ref(`version/data`);

    ref.on('value', handleVersionValue);

    return function ()
    {
      ref.off('value', handleVersionValue);
    }
  }

  useEffect(handleVersion, []);

  return version;
}

export default useHook;