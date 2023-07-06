import { useState } from 'react';

function useHook (key, defaultValue)
{
  const [ filters, update ] = useState (window.sessionStorage.getItem(key) || defaultValue);

  function setFilters (data)
  {
    console.log(data);
    update (data);
    // window.sessionStorage.setItem(key, JSON.stringify(data));
  }

  return [ filters, setFilters ];
}

export default useHook;