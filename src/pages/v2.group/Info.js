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
        width: 84px;
    }

    b
    {
        font-weight: 500;
    }
`

function Comp (
    {
        name,
        count = 0,
    }
)
{   
    return (
        <Container>
            <Primary>{name}</Primary>
            <SecondaryGroup>
                <Secondary>
                    <span>จำนวนนักเรียน</span>
                    <b>{NumberUtil.prettify (count)} คน</b>
                </Secondary>
            </SecondaryGroup>
        </Container>
    )
}

export default Comp