import React, { createRef, useState, useContext, useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Button, Tabs } from 'antd'

import { RootContext } from '../../root';

import Parent from '../../components/Parent'
import SmallProgress from '../../components/SmallProgress'

import QueryUtil from '../../utils/Query'

import Header from '../students.ts.v1/Header';

import Info from '../v2.group/Info'

import ModalEdit from '../v2.group/Modal.Edit'

import TabDashboard from './tab.dashboard';

import TabStudents from './tab.students';
import TabQuizzes from './tab.quizzes';

import TabSummaryBySheets from './tab.summary.by.sheets';
import TabSummaryByQuizTitles from './tab.summary.by.quiz-titles';
import TabSummaryByQuizzes from './tab.summary.by.quizzes';

import TabGroupMissions from '../group.missions'
import TabPersonalMissions from '../group.missions-none'

import TabResearch from '../v2.group/tab.research'

import listenGroup from './listenGroup';

const DEFAULT_TAB = 'dashboard';

const { TabPane } = Tabs

const TABS =
  [
    {
      key: 'dashboard',
      tab: 'แดชบอร์ด',
    },
    
    {
      key: 'summary',
      tab: 'สรุปคะแนน',
    },

    {
      key: 'students',
      tab: 'นักเรียน',
    },

    {
      key: 'quizzes',
      tab: 'ข้อสอบ/แบบฝึกหัด',
    },

    // {
    //   key: 'group-missions',
    //   tab: 'ตรวจการบ้านห้องเรียน',
    // },

    // {
    //   key: 'personal-missions',
    //   tab: 'ตรวจการบ้านรายบุคคล',
    // },

    {
      key: 'research',
      tab: 'วิจัยในชั้นเรียน',
    },
  ]

interface Params
{
  groupId?: string;
}

const Comp: React.FC = () =>
{
  const history = useHistory();
  const match = useRouteMatch();
  const params = match.params as Params;

  const parent = createRef<Parent>();
  const { spaceID } = useContext(RootContext);

  const query = QueryUtil.parse(history.location.search);
  const tab = useMemo(() => (query.tab || DEFAULT_TAB) as string, [query.tab]);

  const groupID = params.groupId || 'null';
  const group = listenGroup({ groupID });

  const [modal, setModal] = useState('')
  // const [downloadState, setDownloadState] = useState(0);

  const hasStudent = (!!query.student && query.student.length > 3)

  const actions = []
  const extra = []

  if (group.fetching !== 'full')
  {
    actions.push(
      (
        <Button
          type="primary"
          onClick={() => setModal('edit')}
        >
          แก้ไขข้อมูล
        </Button>
      ),
      // (
      //     <Button 
      //         type="primary"
      //         onClick={handleDownload} 
      //         disabled={true}
      //     >
      //         ดาวน์โหลดสถิติ
      //     </Button>
      // )
    )

    actions.push(
      <div id="download-button" >

      </div>
    );
    // if (tab === 'students')
    // {
    //   actions.push(
    //     (
    //       <Button
    //         type="primary"
    //         onClick={() => setDownloadState(2)}
    //         disabled={downloadState !== 1}
    //       >
    //         ดาวน์โหลดสถิติ
    //       </Button>
    //     )
    //   )
    // }

    extra.push(
      <Tabs
        key="tabs"
        type="line"
        size="default"
        activeKey={tab}
        onChange={handleTab}
        tabBarStyle={{ marginBottom: 0 }}
        style={{
          borderTop: `1px solid #f0f0f0`
        }}
      >
        {
          TABS.map(function (tab)
          {
            return <TabPane {...tab} />
          })
        }
      </Tabs>
    )
  }

  function handleTab (tab: string)
  {
    const { student } = query

    history.push(`${window.location.pathname}?${QueryUtil.stringify({ student, tab })}`)
  }

  return (
    <Parent ref={parent} >
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          <>
            {
              group.fetching === 'full' ?
                <SmallProgress color="primary" />
                :
                <Info 
                  name={group.name}
                  count={group.students.length}
                />
            }
          </>
        }

        back={
          !!hasStudent ?
            {
              href: `/students/${query.student}`,
              title: `ย้อนกลับ`,
            }
            :
            {
              href: `/groups`,
              title: `ย้อนกลับ`,
            }
        }

        actions={actions}
        extra={extra}
      />

      {
        tab === 'dashboard' &&
        <TabDashboard 
          // onTabChange={handleTab} 
        />
      }

      {
        tab === 'summary' ?
        query.sheetID ?
          query.quizTitle ?
            query.quizID ?
            null
            :
            <TabSummaryByQuizzes group={group} onTabChange={handleTab} />
            :
            <TabSummaryByQuizTitles group={group} />
          :
          <TabSummaryBySheets group={group} />
        :
        null
      }

      {
        tab === 'students' &&
        <TabStudents group={group} />
      }

      {
        tab === 'quizzes' &&
        <TabQuizzes
          group={group}
          onTabChange={handleTab}
        />
      }

      {
        tab === 'group-missions' &&
        <TabGroupMissions
          history={history}
          match={match}
        />
      }

      {
        tab === 'personal-missions' &&
        <TabPersonalMissions
          history={history}
          match={match}
        />
      }

      {
        tab === 'research' &&
        <TabResearch
          group={group}
        />
      }

      <ModalEdit
        open={modal === 'edit'}
        onClose={() => setModal('')}

        space={spaceID}
        group={group._id}

        defaultName={group.name}
      />
    </Parent>
  )
}

export default Comp