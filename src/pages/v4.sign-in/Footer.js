import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    border-radius: 0;
    border-top: 1px solid rgba(255,255,255,0.12);

    width: 100%;
    height: 40px;

    padding: 8px 0 0;
    /* margin: 8px 0; */

    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    align-items: center;
    justify-content: stretch;

    &.loading
    {
        pointer-events: none;
        opacity: 0.5;

        button:
        {
            pointer-events: none;
        }
    }

    span
    {
        flex-grow: 1;
        flex-shrink: 1;

        color: white;

        padding: 8px;
    }

    button
    {
        font-family: inherit;
        user-select: none;

        height: 100%;

        padding: 8px;
        line-height: 1;

        display: flex;
        
        flex-direction: row;

        align-items: center;
        justify-content: center;

        flex-shrink: 0;

        cursor: pointer;

        outline: none;

        border: none;
        border-radius: 2px;

        background: transparent;
        color: #1890ff;

        transition: color 0.2s ease;

        &:hover
        {
            color: white;
        }
    }
`

function Comp (
    {
        loading,
        onClick,
    }
)
{
    const classes = []

    if (!!loading)
    {
        classes.push ('loading')
    }

    const className = classes.join (' ')
    
    return (
        <Container className={className} >
            <span>
                ยังไม่มีบัญชี ?
            </span>
            <button 
                type="button" 
                onClick={onClick}
            >
                สมัครเลย
            </button>
        </Container>
    )
}

export default Comp