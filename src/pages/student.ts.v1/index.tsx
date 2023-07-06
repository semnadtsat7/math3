import React, { createRef, useState, useContext, useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';

import
{
  Button,
  Tabs,
} from 'antd'

import { ArrowLeftOutlined } from '@ant-design/icons';

import { RootContext } from '../../root';

import Parent from '../../components/Parent'
import SmallProgress from '../../components/SmallProgress'

import QueryUtil from '../../utils/Query'

import Header from '../students.ts.v1/Header';

import Info from '../v2.student/Info'

import ModalEdit from '../v2.student/Modal.Edit'

import TabGroups from '../v2.student/tab.groups'

import TabQuizzes from './tab.quizzes';

import TabRewards from '../student.rewards'
import TabMissions from '../student.missions'

import TabSummaryBySheets from './tab.summary.by.sheets';
import TabSummaryByQuizTitles from './tab.summary.by.quiz-titles';
import TabSummaryByQuizzes from './tab.summary.by.quizzes';
import TabSummaryByQuizStatistics from '../student.charts.map.sheet';

import listenStudent from './listenStudent';

const DEFAULT_TAB = 'summary'

const { TabPane } = Tabs

const TABS =
  [
    {
      key: 'summary',
      tab: 'สรุปคะแนน',
    },

    {
      key: 'groups',
      tab: 'กลุ่มเรียน',
    },

    {
      key: 'quizzes',
      tab: 'ข้อสอบ/แบบฝึกหัด',
    },

    {
      key: 'rewards',
      tab: 'รางวัล',
    },

    // {
    //   key: 'missions',
    //   tab: 'การบ้าน',
    // },
  ]

// function Comp (
//   {
//     history,
//     match,
//   }
// )
interface Params
{
  studentId?: string;
}

const Comp: React.FC = () =>
{
  const history = useHistory();
  const match = useRouteMatch();
  const params = match.params as Params;

  const parent = createRef<Parent>();
  const { spaceID } = useContext(RootContext);
  // const { space } = useContext(AppContext)

  const query = QueryUtil.parse(history.location.search);
  const tab = useMemo(() => (query.tab || DEFAULT_TAB) as string, [query.tab]);

  const studentID = params.studentId || 'null'
  const student = listenStudent({ studentID });

  const [modal, setModal] = useState('');
  // const [tab, setTab] = useState((query.tab || DEFAULT_TAB) as string);

  // const info = useInfo(spaceID, student, history)

  const hasGroup = (!!query.group && query.group.length > 3)

  const actions = []
  const extra = []

  if (student.fetching !== 'full')
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
      //     >
      //         ดาวน์โหลดสถิติ
      //     </Button>
      // )
    )

    actions.push(
      <div id="download-button" >

      </div>
    );

    // if (tab === 'summary')
    // {
    //   // actions.push(
    //   //   (
    //   //     <Button
    //   //       type="primary"
    //   //       onClick={handleDownload}
    //   //     >
    //   //       ดาวน์โหลดสถิติ
    //   //     </Button>
    //   //   )
    //   // )
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
    const { group } = query

    history.push(`${window.location.pathname}?${QueryUtil.stringify({ group, tab })}`)

    // setTab(tab)
  }

  return (
    <Parent ref={parent} >
      <div 
        style={{  
          backgroundColor: "#1890ff",
          height: "40px"
        }}
      >        
        <Button
          type="primary"
          onClick={history.goBack}
          style={{ height: "40px", fontSize: "13px", marginTop: "0px" }}
        >
          <ArrowLeftOutlined/>
          <span style={{ marginLeft: "30px" }}>
            ย้อนกลับ
          </span>
        </Button>
      </div>
      
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={
          <>
            {
              student.fetching === 'full' ?
                <SmallProgress color="primary" />
                :
                <Info 
                  name={student.name}
                  coin={student.coin}
                  customId={student.customId}
                />
            }
          </>
        }

        back={
          !!hasGroup ?
          {
            href: `/groups/${query.group}`,
            title: `กลับไปที่กลุ่มเรียน`,
          }
          :
          undefined
        }

        actions={actions}
        extra={extra}
      />

      {
        tab === 'summary' ?
          query.sheetID ?
            query.quizTitle ?
              query.quizID ?
              <TabSummaryByQuizStatistics
                history={history}
                match={match}
              />
              :
              <TabSummaryByQuizzes 
                student={student}
              />
              :
              <TabSummaryByQuizTitles
                student={student}
              />
            :
            <TabSummaryBySheets
              student={student}
            />
          :
          null
      }

      {
        tab === 'groups' &&
        <TabGroups
          history={history}
          match={match}
        />
      }

      {
        tab === 'quizzes' &&
        <TabQuizzes
          // history={history}
          // match={match}
        />
      }

      {
        tab === 'rewards' &&
        <TabRewards
          history={history}
          match={match}
        />
      }

      {
        tab === 'missions' &&
        <TabMissions
          history={history}
          match={match}
        />
      }

      <ModalEdit
        open={modal === 'edit'}
        onClose={() => setModal('')}

        space={spaceID}
        student={studentID}

        defaultName={student.name}
        defaultCustomId={student.customId}
      />
    </Parent>
  )
}

export default Comp