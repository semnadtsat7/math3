import React from 'react'
import styled from 'styled-components'

import DateTimeUtil from '../utils/DateTime'

const Container = styled.div`
    display: flex;
    flex-direction: column;

    line-height: 1.1;

    small
    {
        color: #a7a7a7;
    }
`

export default function (
    {
        value,
    }
)
{
    return (
        <Container>
            <span>{DateTimeUtil.getDate(value)}</span>
            <small>{DateTimeUtil.getTime(value)}</small>
        </Container>
    )
}