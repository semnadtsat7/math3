import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
// import teal from '@material-ui/core/colors/teal';
import Flexbox from './Flexbox';

const Progress = ({ color = 'secondary' }) =>
{
    return (
        <Flexbox>
            <CircularProgress color={color} size={16} />
        </Flexbox>
    )
}

export default Progress