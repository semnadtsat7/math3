import React from 'react';
// import styled from 'styled-components';

import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 180;

const styles = theme => ({
    drawerPaper: {
        backgroundColor: '#333',
        // backgroundColor: '#333b3e',
        width: drawerWidth,
        border: 'none',
    },
});

const MenuDrawer = (props) =>
{
    return (
        <Drawer  
            {...props}
            classes={{ paper: props.classes.drawerPaper, }}
        />
    )
}

export default withStyles(styles, { withTheme: true })(MenuDrawer);