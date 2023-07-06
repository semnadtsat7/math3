import React from 'react'
import styled, { keyframes } from 'styled-components'

import { Spin, Icon } from 'antd'

const Shake = keyframes`
    10%, 90% 
    {
        transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% 
    {
        transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% 
    {
        transform: translate3d(-4px, 0, 0);
    }

    40%, 60% 
    {
        transform: translate3d(4px, 0, 0);
    }
`

const Submit = styled.div`
    box-shadow: 1px 1px 5px rgba(0,0,0, 0.5);
    border-radius: 2px;

    width: 100%;
    height: 40px;

    padding: 0;
    margin: 16px 0;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    &.error
    {
        animation: ${Shake} 0.82s cubic-bezier(.36,.07,.19,.97) both;
    }

    &.loading
    {
        pointer-events: none;
        filter: grayscale(0.5);

        span
        {
            display: flex;

            flex-direction: row;

            align-items: center;
            justify-content: center;

            .text
            {
                margin-left: 8px;
            }
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

        background: #1890ff;
        color: white;

        transition: background 0.2s ease;

        &:hover
        {
            background: #005db3;
        }
    }
`

const LoadingIcon = <Icon type="loading" style={{ fontSize: 24, color: 'white' }} spin />

function Comp (
    {
        error,
        text,

        loading,
        loadingText,
    }
)
{
    const classes = []

    if (!!loading)
    {
        classes.push ('loading')
    }
    else if (!!error)
    {
        classes.push ('error')
    }
    
    const className = classes.join (' ')

    return (
        <Submit className={className}>
            <button type="submit" >
                {
                    !!loading ?
                    <span>
                        <Spin indicator={LoadingIcon} />
                        <span className="text" >{loadingText}</span>
                    </span>
                    :
                    text
                }
            </button>
        </Submit>
    )
}

export default Comp