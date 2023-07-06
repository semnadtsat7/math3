import React from 'react'
import styled from 'styled-components'

const Forgot = styled.div`
    border-radius: 2px;

    width: 100%;
    height: 32px;

    padding: 0;
    margin: 8px 0;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    &.loading
    {
        pointer-events: none;
        opacity: 0.5;
    }

    &.disabled
    {
        pointer-events: none;
        opacity: 0;

        button
        {
            pointer-events: none;
        }
    }

    button
    {
        font-family: inherit;
        user-select: none;

        width: 100%;
        height: 100%;

        padding: 0;

        display: flex;
        
        flex-direction: row;

        align-items: center;
        justify-content: center;

        cursor: pointer;

        outline: none;

        border: none;
        border-radius: 2px;

        background: transparent;
        color: white;

        transition: color 0.2s ease;

        &:hover
        {
            color: #1890ff;
        }
    }
`

function Comp (
    {
        disabled,
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

    if (!!disabled)
    {
        classes.push ('disabled')
    }
    
    const className = classes.join (' ')

    return (
        <Forgot className={className}>
            <button 
                type="button" 
                disabled={disabled} 
                onClick={onClick}
            >
                ลืมรหัสผ่าน ?
            </button>
        </Forgot>
    )
}

export default Comp