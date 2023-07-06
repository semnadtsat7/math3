import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Row = styled.div`
    display: flex;

    flex-direction: row;

    align-items: center;
    justify-content: flex-start;

    background: white;
    box-shadow: 1px 1px 5px rgba(0,0,0, 0.5);
    border-radius: 2px;

    width: 100%;
    height: 40px;

    margin: 2px 0;
    padding: 0 10px;

    transition: box-shadow 0.2s ease;

    &.focused
    {
        box-shadow: 1px 1px 10px 1px rgba(0,0,0, 0.5);

        .icon
        {
            fill: #333;
        }

        input::placeholder
        {
            color: #666;
        }
    }

    &.error
    {
        border: 1px solid #f5222d;

        .icon
        {
            fill: #f5222d;
        }
    }

    &.disabled
    {
        pointer-events: none;
        background: #ddd;

        .icon
        {
            fill: #aaa;
        }

        input
        {
            pointer-events: none;
            user-select: none;
            
            color: #666;
        }
    }
    
    .icon
    {
        width: 18px;
        height: 18px;

        flex-shrink: 0;
        fill: #999;

        div
        {
            display: flex;
        }

        svg
        {
            width: 100%;
            height: 100%;

            transition: fill 0.2s ease;
        }
    }

    .input
    {
        width: 100%;
        height: 40px;

        input
        {
            font-family: inherit;
            flex-shrink: 1;

            outline: none;

            border: none;
            background: transparent;

            width: 100%;
            padding-top: 3%;

            color: #333;

            &::placeholder
            {
                transition: color 0.2s ease;
                color: #a7a7a7;
            }
        }
    }
    
    .divider.vertical
    {
        flex-shrink: 0;

        width: 1px;
        height: 18px;

        background: rgba(0,0,0, 0.12);

        margin: 8px 10px;
    }

    .suffix
    {
        button
        {
            width: 24px;
            height: 24px;

            padding: 0;

            display: flex;
            
            flex-direction: row;

            align-items: center;
            justify-content: center;

            cursor: pointer;

            outline: none;

            border: none;
            border-radius: 50%;

            background: transparent;
            transition: background 0.2s ease;
            
            @media (hover: hover)
            {
                &:hover
                {
                    background: #d9d9d9;
                    
                    .icon
                    {
                        fill: #666;
                    }
                }
            }
        }
    }
`

function Comp (
    {
        prefix,
        suffix,

        type,
        defaultValue,

        placeholder,

        minLength,
        maxLength,

        onChange,

        error,
        disabled,
    }
)
{
    const [ value, setValue ] = useState (defaultValue)
    const [ focused, setFocused ] = useState (false)

    function handleChange (e)
    {
        setValue (e.target.value)

        if (!!onChange)
        {
            onChange (e.target.value)
        }
    }

    function handleMount ()
    {
        setValue (defaultValue)
    }

    useEffect (handleMount, [])

    const classes = []

    if (!!disabled)
    {
        classes.push ('disabled')
    }
    else if (!!error)
    {
        classes.push ('error')
    }

    if (!!focused)
    {
        classes.push ('focused')
    }
    
    const className = classes.join (' ')

    return (
        <Row className={className} >
            {prefix}
            {
                !!prefix && <div className="divider vertical" />
            }
            <div className="input" >
                <input 
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
										minLength={minLength}
                    maxLength={maxLength}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setFocused (true)}
                    onBlur={() => setFocused (false)}
                />
            </div>
            {suffix}
        </Row>
    )
}

export default Comp