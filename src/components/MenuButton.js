import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const MenuButton = (props) =>
{
    return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            style={{ marginRight: 12, color: '#424242' }}
            {...props}
        >
            <MenuIcon fontSize="small" style={{ width: 22, height: 22 }} />
        </IconButton>
    )
}

export default MenuButton;