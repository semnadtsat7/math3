import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import teal from '@material-ui/core/colors/teal';

import Flexbox from './Flexbox';

const Progress = (props) =>
{
    return (
        <Flexbox style={{ minHeight: 120 }} >
            <CircularProgress style={{ color: teal[500] }} {...props} />
        </Flexbox>
    )
}

export default Progress;