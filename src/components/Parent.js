import React from 'react';
import styled from 'styled-components';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Reboot from '@material-ui/core/CssBaseline';

import teal from '@material-ui/core/colors/teal';

import MenuDrawer from './MenuDrawer';
import Menu from './Menu.v2';

const theme = createMuiTheme({
    typography: {
        // Use the system font over Roboto.
        fontFamily: 'Sarabun, sans-serif',
        // htmlFontSize: 18,
        useNextVariants: true,
    },

    palette: {
        type: 'light',
        primary: teal,
    },
});

class Parent extends React.Component
{
    constructor (props)
    {
        super (props);

        this.state = 
        { 
            menu: true,
            mobile: false,
        };

        this.handleResize = this.handleResize.bind(this);
        this.toggleMenu   = this.toggleMenu.bind(this);
    }

    componentDidMount () 
    {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount ()
    {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize (e)
    {
        const mobile = window.innerWidth < 1024;
        this.setState({ mobile });

        if (this.state.menu)
        {
            if(window.innerWidth < 1024)
            {
                this.setState({ menu: false });
            }
        }
        else 
        {
            if(window.innerWidth >= 1024)
            {
                this.setState({ menu: true });
            }
        }
    }

    toggleMenu ()
    {
        this.setState({ menu: !this.state.menu });
    }

    render ()
    {
        const { menu, mobile } = this.state;
        const { children, disabled } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <Screen disabled={disabled}>
                    <Reboot />
                    <MenuDrawer
                        variant={mobile ? "temporary" : "persistent"}
                        open={menu}
                        onClose={e => this.setState({ menu: false })}
                    >
                        <Menu />
                    </MenuDrawer>
                    <Content shift={!!menu && !mobile}>
                        {children}
                    </Content>
                </Screen>
            </MuiThemeProvider>
        )
    }
}

const Screen = styled.div`
    display: flex;
            
    flex: 0 1 auto;
    flex-wrap: nowrap;
    flex-direction: row;

    box-sizing: border-box;

    width: 100%;
    height: 100%;

    padding: 0;
    margin: 0;
`

const Content = styled.div`
    transition: 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    flex-basis: 100%;

    display: flex;

    max-width: 100vw;

    flex-direction: column;
    flex: 1 0 auto;

    position: relative;
    box-sizing: border-box;

    ${props => props.shift && `
        margin-left: 180px;
        max-width: calc(100vw - 180px);
    `}

    @media (min-width: 1440px)
    {
        max-width: 91vw;

        ${props => props.shift && `
            max-width: calc(91vw - 180px);
        `}
    }

    @media (min-width: 1600px)
    {
        max-width: 83.332vw;

        ${props => props.shift && `
            max-width: calc(83.332vw - 180px);
        `}
    }

    @media (min-width: 1920px)
    {
        max-width: 66.662vw;

        ${props => props.shift && `
            max-width: calc(66.662vw - 180px);
        `}
    }
`

export default Parent;