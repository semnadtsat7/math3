import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: 
    {
        backgroundColor: 'white',
        position: 'relative',
        borderBottom: '1px solid rgb(224, 224, 224)',
    },

    toolbar:
    {
        // paddingLeft: 4,
        // paddingRight: 4,
    },
});

const ActionBar = (props) =>
{
    return (
        <React.Fragment>
            <AppBar elevation={0} color="default" className={props.classes.appBar} >
                <Toolbar 
                    variant="dense" 
                    disableGutters={true} 
                    className={props.classes.toolbar}
                >
                    {props.children}
                </Toolbar>
            </AppBar>
            {/* <span style={{ minHeight: 57 }} /> */}
        </React.Fragment>
    )
}

export default withStyles(styles, { withTheme: true })(ActionBar);