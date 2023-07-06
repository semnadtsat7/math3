import React from 'react';
import TextField from '@material-ui/core/TextField';

export default (props) =>
{
    let { inputProps } = props;
    
    if (inputProps)
    {
        if (inputProps.style)
        {
            inputProps.style = Object.assign({ lineHeight: 1.6 }, inputProps.style);
        }
        else
        {
            inputProps.style = { lineHeight: 1.6 };
        }
    }
    else
    {
        inputProps = { style: { lineHeight: 1.6 } };
    }

    return <TextField {...props} inputProps={inputProps} />
}