import React from 'react';
import { useParams } from 'react-router-dom';

import listenProgress from './listenProgress';

import GroupItem from '../GroupItem';

import Total from './Total';
import BySheets from './BySheets';

interface Params
{
  groupId?: string;
}

const Comp: React.FC = () =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null'

  const { view } = listenProgress({ groupID });

  return (
    <>
      <GroupItem 
        sm="220px"
      >
        <Total view={view} />
      </GroupItem>

      <GroupItem 
        sm="calc(100% - 220px)"
        // // md="calc(100% - 220px - 200px)"
        // // lg="360px"
        // // xl="480px"
        // // style={{ maxWidth: 640 }}
        // max={
        //   {
        //     md: '560px',
        //     xl: '720px'
        //   }
        // }
      >
        <BySheets view={view} />
      </GroupItem>
    </>
  );
}

export default Comp;