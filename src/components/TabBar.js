import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';

// import { withStyles } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

// const styles = theme => ({
//     appBar: 
//     {
//         backgroundColor: 'white',
//         position: 'relative',
//         // borderBottom: '1px solid rgb(224, 224, 224)',
//     },
// });

const theme = createMuiTheme({
    palette: {
        primary: teal,
    },

    typography: {
        fontFamily: 'Sarabun, sans-serif',
        useNextVariants: true,
    },
});

const ActionBar = (props) =>
{
    return (
        <MuiThemeProvider theme={theme}>
            <AppBar 
                elevation={0} 
                color="default"  
                style={{
                    backgroundColor: 'white',
                    position: 'relative',
                    borderBottom: '1px solid rgb(224, 224, 224)',
                }}
            >
                <Tabs 
                    indicatorColor="primary"
                    textColor="primary"
                    scrollable
                    // centered
                    fullWidth
                    {...props}
                />
            </AppBar>
        </MuiThemeProvider>
    )
}

export default ActionBar;
// export default withStyles(styles, { withTheme: true })(ActionBar);