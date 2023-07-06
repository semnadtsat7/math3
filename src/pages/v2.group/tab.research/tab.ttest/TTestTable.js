import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Tooltip, Icon } from 'antd'

import NumberUtil from '../../../../utils/NumberTS';

import AppContext from '../../../../AppContext';
import useInfo from '../../useInfo';

const Container = styled.div`
    width: 100%;

    .table
    {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        flex-direction: column;

        overflow-x: auto;
        
        margin: 8px 0;

        border: 1px solid #eee;

        .row
        {
            width: 100%;

            display: flex;
            align-items: stretch;
            justify-content: flex-start;

            flex-direction: row;
            flex-wrap: nowrap;

            &:not(:last-child)
            {
                border-bottom: 1px solid #eee;
            }

            .col
            {
                padding: 8px;

                &:not(:first-child)
                {
                    flex-shrink: 0;
                }

                &.left
                {
                    text-align: left;
                }

                &.right
                {
                    text-align: right;
                }
            }
        }
    }
`

function toFloat (value = 0)
{
    return NumberUtil.prettifyF (value, 2);
}

function toInt (value = 0)
{
    return NumberUtil.prettify (value);
}

function Comp (
    {
        students,
        ttest,
    }
)
{
    const { space } = useContext (AppContext)

    const { groupId } = useParams (); 
    const history = useHistory ();
    
    const group = groupId || 'null'
    const info = useInfo (space, group, history)

    const groupName = info.fetching ? 'กำลังโหลด ...' : info.name;
    
    let dir = '';
    let summary = '';

    if (ttest.t > ttest.tc1t)
    {
        dir = 'สูงกว่าก่อนเรียน';
    }
    else if (ttest.t < -ttest.tc1t)
    {
        dir = 'ต่ำกว่าหรือเท่ากับก่อนเรียน';
    }
    else
    {
        dir = 'ไม่แตกต่างกับก่อนเรียน';
    }

    if (typeof dir === 'string' && dir.length > 0)
    {
        summary = <>จากตาราง พบว่า <strong>"{groupName}"</strong> มีผลสัมฤทธิ์ทางการเรียนคณิตศาสตร์ หลังเรียน <strong>{dir}</strong> อย่างมีนัยสำคัญที่ระดับ .05 โดยมีค่า t = {toFloat (ttest.t)}</>;
    }

    const items = 
    [
        {
            name: '',
            a: 'หลังเรียน',
            b: 'ก่อนเรียน',
        },
        {
            name: 'Mean',
            a: toFloat (ttest.mean.y),
            b: toFloat (ttest.mean.x),
        },
        {
            name: 'Variance',
            a: toFloat (ttest.variance.y),
            b: toFloat (ttest.variance.x),
        },
        {
            name: (
                <>
                    <span style={{ marginRight: 8 }} >Observations</span>
                    <Tooltip 
                        title="ไม่นับนักเรียนที่ยังไม่ได้ทำก่อนและหลังเรียน" 
                        overlayStyle={{ zIndex: 15000 }}
                    >
                        <Icon type="info-circle" />
                    </Tooltip>
                </>
            ),
            a: toFloat (ttest.observations.y),
            b: toFloat (ttest.observations.x),
        },
        {
            name: 'Pearson Correlation',
            a: toFloat (ttest.pearson),
        },
        {
            name: 'Hypothesized Mean Difference',
            a: '0.00',
        },
        {
            name: 'df',
            a: toFloat (ttest.df),
        },
        {
            name: 't Stat',
            a: toFloat (ttest.t),
        },
        {
            name: 'P(T<=t) one-tail',
            a: toFloat (ttest.p1t),
        },
        {
            name: 't Critical one-tail',
            a: toFloat (ttest.tc1t),
        },
        {
            name: 'P(T<=t) two-tail',
            a: toFloat (ttest.p2t),
        },
        {
            name: 't Critical two-tail',
            a: toFloat (ttest.tc2t),
        },
        {

        },
        {
            name: 'คะแนนทดสอบ',
            a: 'ก่อนเรียน',
            b: 'หลังเรียน',
        },
        {
            name: 'n',
            a: toInt (ttest.n.x),
            b: toInt (ttest.n.y),
        },
        {
            name: 'mean',
            a: toFloat (ttest.mean.x),
            b: toFloat (ttest.mean.y),
        },
        {
            name: 'S.D.',
            a: toFloat (ttest.variance.x),
            b: toFloat (ttest.variance.y),
        },
        {
            name: 't',
            a: toFloat (ttest.t),
        },
        {
            name: 'df',
            a: toFloat (ttest.df),
        },
        {
            name: 'sig',
            a: toFloat (ttest.sig),
        },
        {
            name: <small>*ระดับนัยสำคัญที่ .05</small>
        },
        {

        },
    ]

    return (
        <Container>
            <div className="table" >
                {
                    items.map ((item, i) =>
                    {
                        return (
                            <div key={item.name + '-' + i} className="row" >
                                <div 
                                    className="col left" 
                                    style={{ width: 'calc(100% - 180px)' }}
                                >
                                    {item.name}
                                </div>
                                <div 
                                    className="col right" 
                                    style={{ width: '90px' }} 
                                >
                                    {item.a}
                                </div>
                                <div 
                                    className="col right" 
                                    style={{ width: '90px' }} 
                                >
                                    {item.b}
                                </div>
                            </div>
                        )
                    })
                }
                <div key={'summary'} className="row" >
                    <div 
                        className="col left" 
                        style={{ width: '100%' }}
                    >
                        {summary}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Comp;