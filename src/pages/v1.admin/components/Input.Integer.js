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

    width: 100%;
    height: 100%;

    min-height: fit-content;
    resize: none;

    ${props => props.disabled && `
        pointer-events: none;
        background-color: #fafafa;
        opacity: 0.5;
    `}
`

function Component(
    {
        disabled,

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
                        rows={1}
                        value={value}
                        onChange={e => onChange (e.target.value.replace (/\D*/g, ''))}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                )
            }
        </Delay>
    )
}

export default Component