import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { 
    Tabs,
} from 'antd'

// import styled from 'styled-components'

import QueryUtil from '../../../utils/Query'

import TabTTest from './tab.ttest'
import TabDifficult from './tab.difficult'

// const Card = styled.div`
//     /* background: white; */

//     /* border-radius: 4px;
//     border: 1px solid #d9d9d9;

//     margin: 8px; */
// `

const DEFAULT_TAB = 'ttest'

const { TabPane } = Tabs

const TABS = 
[
    {
        key: 'ttest',
        tab: 'T-Test Pair Model',
    },

    {
        key: 'difficult',
        tab: 'ค่าความยากง่าย อำนาจจำแนก ค่าความเชื่อมั่น',
    },
]

function Comp (
    {
        // history,
        // match,

        group,
    }
)
{
    const history = useHistory();

    const query = QueryUtil.parse (history.location.search)
    const [ subTab, setSubTab ] = useState (query.subTab || DEFAULT_TAB)

    function handleSubTab (subTab)
    {
        history.push(`${window.location.pathname}?${QueryUtil.stringify({ ...query, subTab })}`)
        setSubTab (subTab)
    }

    return (
        <Fragment>
            <Tabs  
                key="tabs"
                type="line"
                size="default"
                activeKey={subTab}
                onChange={handleSubTab}
                tabBarStyle={{ marginBottom: 0, background: 'white' }}
                style={{ flexShrink: 0 }}
            >
                {
                    TABS.map(function (tab)
                    {
                        return <TabPane {...tab} />
                    })
                }
            </Tabs>
            {
                subTab === 'ttest' &&
                <TabTTest 
                    group={group}
                    // history={history}
                    // match={match}
                />
            }
            {
                subTab === 'difficult' &&
                <TabDifficult 
                    group={group}
                />
            }
        </Fragment>
    )
}

export default Comp