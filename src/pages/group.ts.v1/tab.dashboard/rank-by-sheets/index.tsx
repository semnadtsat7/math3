import React from 'react';
import { useParams } from 'react-router-dom';

import listenSheets from './listenSheets';

import GroupItem from '../GroupItem';
import Card from '../Card';

import Sheets from './Sheets';

interface Params
{
  groupId?: string;
}

const Comp: React.FC = () =>
{
  const params = useParams() as Params;
  const groupID = params.groupId || 'null';

  const { view } = listenSheets({ groupID });  

  return (
    <>
      <GroupItem 
        md="50%"
      >
        <Card>
          <label>รายชื่อนักเรียนที่ได้คะแนนสะสมสูงสุด 3 อันดับแรกในแต่ละบทเรียน</label>
          <Sheets 
            view={view} 
            name="highests"
            groupID={groupID}
          />
        </Card>
      </GroupItem>

      <GroupItem 
        md="50%"
      >
        <Card>
          <label>รายชื่อนักเรียนที่ได้คะแนนสะสมน้อยสุด 3 อันดับแรกในแต่ละบทเรียน</label>
          <Sheets 
            view={view} 
            name="lowests"
            groupID={groupID}
          />
        </Card>
      </GroupItem>
    </>
  );
}

export default Comp;