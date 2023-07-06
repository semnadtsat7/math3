import React from 'react'
import { AccountCircleTwoTone } from '@material-ui/icons'

import Input from './Input'

function InputEmail (
    {
        defaultValue = '',
        onChange,

        error,
        disabled,
    }
)
{
    return (
        <Input 
            type="email"
            placeholder="อีเมล"
            defaultValue={defaultValue}
            minLength={1}
            maxLength={120}
            onChange={onChange}
            error={error}
            disabled={disabled}
            prefix={
                <div className="icon" >
                    <AccountCircleTwoTone />
                </div>
            }
        />
    )
}

export default InputEmail