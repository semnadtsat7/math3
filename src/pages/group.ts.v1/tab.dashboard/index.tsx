import React, { Fragment } from 'react';
// import { useRouteMatch } from 'react-router-dom';

import ProgressBySheets from './progress-by-sheets';
import ProgressByQuizzes from './progress-by-quizzes';
import StudentActives from './student-actives';
import StudentInactives from './student-inactives';
import RankBySheets from './rank-by-sheets';
import Scatter from './scatter';

import Group from './Group';
import GroupItem from './GroupItem';

// interface Params
// {
//   groupId?: string;
// }

interface Props
{
  // onTabChange (tab: string): void;
}

const Comp: React.FC<Props> = () =>
{
  // const match = useRouteMatch();

  // const params = match.params as Params;
  // const groupID = params.groupId || 'null';

  return (
    <Fragment>
      {/* <div style={{ maxWidth: `100%` }} >
        <ProgressBySheets />
      </div> */}
      <div style={{ padding: 6 }} >
        <Group>
          <GroupItem
            // md="calc(100% - 200px)"
            // xxl="calc(100% - 240px)"
            // max={
            //   {
            //     xl: '940px'
            //   }
            // }

            xxl="calc(100% - 240px)"
            max={
              {
                md: 'calc(100% - 200px)',
                xl: 'calc(100% - 240px)',
                xxl: '940px',
              }
            }
          >
            <Group>
              <ProgressBySheets />
            </Group>
            <Group>
              <ProgressByQuizzes />
            </Group>
            <Group>
              <Scatter />
            </Group>
            <Group>
              <RankBySheets />
            </Group>
          </GroupItem>
          <GroupItem
            // md="200px"
            // xxl="240px"
            // max={
            //   {
            //     sm: '200px',
            //     xl: '240px',
            //   }
            // }
            md="200px"
            xl="240px"
          >
            <Group>
              <StudentActives />
              <StudentInactives />
            </Group>
          </GroupItem>
        </Group>
      </div>
    </Fragment>
  );
}

export default Comp;