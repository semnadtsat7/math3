import React from 'react'

interface State
{
    space: string;
    setSpace? (spaceID: string): void;
}

const state: State = 
{
    space: '',
    // setSpace,
}

export default React.createContext (state)