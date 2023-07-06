import React from 'react'
import styled from 'styled-components'

import { Select } from 'antd'

const { Option } = Select

const Container = styled.div`
    padding: 8px 12px;
    margin: 0;

    display: flex;

    flex-grow: 1;

    border: none;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    .ant-select
    {
        flex-grow: 1;
        height: 32px;
    }

    ${props => props.disabled && `
        pointer-events: none;
        background-color: #fafafa;
        opacity: 0.5;
    `}
`

function Component(
    {
        disabled,

        options = [],
        value,
        
        onChange,
        onFocus,
        onBlur,
    }
)
{
    return (
        <Container disabled={disabled} >
            <Select
                value={value}

                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                {
                    options.map (({ key, value, children }) =>
                    {
                        return (
                            <Option key={key} value={value}>{children}</Option>
                        )
                    })
                }
            </Select>
        </Container>
    )
}

export default Component