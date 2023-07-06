import React, { useState } from 'react'
import { LockTwoTone, VisibilityOffTwoTone, VisibilityTwoTone } from '@material-ui/icons'
import Input from './Input'

function InputPassword (
    {
        defaultValue = '',
        onChange,

        error,
        disabled,
    }
)
{
    const [ visible, setVisible ] = useState (false)

    return (
        <Input
            type={!!visible ? `text` : `password`}

            placeholder="รหัสผ่าน"

            minLength={6}
            maxLength={32}

            defaultValue={defaultValue}
            onChange={onChange}
            
            error={error}
            disabled={disabled}

            prefix={
                <div className="icon" >
                    <LockTwoTone />
                </div>
            }

            suffix={
                <div className="suffix" >
                    <button
                        type="button"
                        onClick={() => setVisible (!visible)}
                    >
                        <div className="icon" >
                            {
                                !!visible ?
                                <VisibilityOffTwoTone />
                                :
                                <VisibilityTwoTone />
                            }
                        </div>
                    </button>
                </div>
            }
        />
    )
}

export default InputPassword