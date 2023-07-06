import React from 'react'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

import
{
  Typography,
  Button,
} from '@material-ui/core'

import
{
  ArrowBack,
} from '@material-ui/icons'

import ActionBar from '../../components/ActionBar'
import MenuButton from '../../components/MenuButton'

const Layout = styled.div`
    width: 100%;
`

const Back = styled.div`
    background-color: #1890ff;
    height: 40px;

    .icon
    {
        padding-right: 24px;
    }
`

const Container = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;

    align-items: center;

    padding: 4px;
`

const Toggler = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    align-items: flex-start;

    margin-top: -2px;
    margin-bottom: auto;

    height: 44px;
`

const Toolbar = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: wrap;

    align-items: flex-start;

    flex-grow: 1;
`

const Title = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;

    align-items: center;

    min-height: 40px;
`

const ActionGroup = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;

    align-items: center;

    padding: 0;
    
    height: 40px;
`

const Action = styled.div`
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 4px;
`

type Props =
  {
    onMenuClick?: Function;

    title?: any;
    actions?: any[];

    back?:
    {
      href: string;
      title: any;
    };

    extra?: any;
  }

const Comp: React.FC<Props> = (
  {
    onMenuClick,

    title,
    actions,

    back,
    extra,
  }
) =>
{
  return (
    <ActionBar >
      <Layout>
        {
          !!back &&
          <Back>
            <Link to={back.href} >
              <Button
                variant="text"
                size="small"
                style={{
                  color: 'white',
                  height: 40,
                  padding: `7px 18px`,
                  lineHeight: 1,
                }}
              >
                <div className="icon">
                  <ArrowBack fontSize="small" />
                </div>
                {back.title}
              </Button>
            </Link>
          </Back>
        }
        <Container>
          <Toggler>
            <MenuButton onClick={onMenuClick} />
          </Toggler>
          <Toolbar>
            <Title>
              <Typography
                variant="subtitle2"
                color="inherit"
                noWrap={true}
                style={{ marginRight: 16 }}
              >
                {title}
              </Typography>
            </Title>
            {
              actions && actions.length > 0 &&
              <ActionGroup>
                {
                  actions.map((action, i) =>
                  {
                    return (
                      <Action key={i} >
                        {action}
                      </Action>
                    )
                  })
                }
              </ActionGroup>
            }
          </Toolbar>
        </Container>
        {extra}
      </Layout>
    </ActionBar>
  )
}

Comp.defaultProps = 
{
  actions: [],
}

export default Comp;