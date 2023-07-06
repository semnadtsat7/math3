import React, { createContext, useState, useEffect } from 'react';
import listenVersion, { ListenVersionResult } from '../hooks/listenVersion';

export type RootContextValue = 
  {
    spaceID: string;
    version: ListenVersionResult;
  }

export type RootProps =
  {
    spaceID: string;
  }

const DEFAULT_CONTEXT_VALUE: RootContextValue =
{
  spaceID: '',
  version: {},
};

const RootContext = createContext(DEFAULT_CONTEXT_VALUE);

const Root: React.FC<RootProps> = (
  {
    children,
    spaceID,
  }
) =>
{
  const version = listenVersion({ spaceID });
  const [visible, setVisible] = useState(false);

  const value: RootContextValue = 
  {
    spaceID,
    version,
  };

  function handleSpaceChange ()
  {
    setVisible(false);
    setTimeout(() => setVisible(true), 50);
  }

  useEffect(handleSpaceChange, [spaceID]);

  // if (!ready)
  // {
  //   return (
  //     <Loader />
  //   );
  // }

  if (!visible)
  {
    return null;
  }

  return (
    <RootContext.Provider 
      value={value}
    >
      {children}
    </RootContext.Provider>
  );
};

export { RootContext };
export default Root;