import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
    padding: 8px 12px;
    margin: 0;

    display: flex;

    flex-grow: 1;

    border: none;
    box-sizing: border-box;

    min-height: fit-content;

    opacity: 0.5;
    user-select: none;
`

function Component(
    {
        value,
    }
)
{
    return (
        <Span>{value}</Span>
    )
}

export default Component