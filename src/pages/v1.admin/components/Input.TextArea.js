import React from 'react'
import styled from 'styled-components'

import Delay from './Input.Delay'

const Input = styled.textarea`
    padding: 8px 12px;
    margin: 0;

    display: flex;

    flex-grow: 1;

    border: none;
    box-sizing: border-box;

    min-height: fit-content;

    ${props => props.resizable && `
        resize: vertical;
    `}

    ${props => !props.resizable && `
        resize: none;
    `}

    ${props => props.disabled && `
        pointer-events: none;
        background-color: #fafafa;
        opacity: 0.5;
    `}
`

function Component(
    {
        disabled,

        resizable = true,
        rows = 1,

        defaultValue,
        value,

        onChange,
        onFocus,
        onBlur,

        onTypingStart,
        onTypingEnd,
    }
)
{
    return (
        <Delay 
            value={value}
            onChange={(value, dirty) => onChange (value, dirty)}
            onFocus={onFocus}
            onBlur={onBlur}
            onTypingStart={onTypingStart}
            onTypingEnd={onTypingEnd}
        >
            {
                ({ value, onChange, onFocus, onBlur }) => (
                    <Input 
                        disabled={disabled}
                        resizable={resizable}
                        rows={rows}
                        defaultValue={defaultValue}
                        value={value}
                        onChange={e => onChange (e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                )
            }
        </Delay>
    )
}

export default Component