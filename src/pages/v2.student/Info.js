import React from 'react'
import styled from 'styled-components'

import NumberUtil from '../../utils/Number'

const Container = styled.div`
    display: flex;

    flex-direction: column;

    padding: 8px 0;
`

const Primary = styled.span`
    font-weight: 500;
`

const SecondaryGroup = styled.div`
    /* display: flex;

    flex-direction: row;
    flex-wrap: wrap; */

    padding-top: 4px;
`

const Secondary = styled.span`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    line-height: 1.2;

    font-size: 0.85em;

    span
    {
        color: #666;
        width: 72px;
    }

    b
    {
        font-weight: 500;
    }
`

function Comp (
    {
        name,
        customId,

        coin,
    }
)
{   
    return (
        <Container>
            <Primary>{name}</Primary>
            <SecondaryGroup>
                <Secondary>
                    <span>รหัสนักเรียน</span>
                    <b>{customId}</b>
                </Secondary>

                <Secondary>
                    <span>ดาวสะสม</span>
                    <b>{NumberUtil.prettify (coin)} ดวง</b>
                </Secondary>
            </SecondaryGroup>
        </Container>
    )
}

export default Comp