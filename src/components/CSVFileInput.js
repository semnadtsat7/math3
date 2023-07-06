import React from 'react'
import CSVToJSON from 'csvtojson'

import styled from 'styled-components'

const StyledInput = styled.input`
    width: 100%;
`

class Input extends React.Component
{
    onChange = async (e) =>
    {
        const { onChange } = this.props
        const file = e.target.files[0]
        
        if (!!file)
        {
            const reader = new FileReader ()

            reader.onload = async e =>
            {
                const text = e.target.result

                CSVToJSON()
                .fromString (text)
                .then (csv => 
                {
                    if (!!onChange)
                    {
                        onChange (csv)
                    }
                })
            }

            reader.readAsText (file)
        }
        else if (!!onChange)
        {
            onChange ([])
        }
    }

    render ()
    {
        const { disabled } = this.props

        return (
            <div>
                <StyledInput 
                    ref="input"
                    type="file" 
                    accept=".csv"
                    onChange={this.onChange}
                    disabled={disabled}
                />
            </div>
        )
    }
}

export default Input