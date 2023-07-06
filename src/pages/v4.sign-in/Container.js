import React from 'react'
import styled from 'styled-components'

const Background = styled.div`
    background: url('/images/bg-01.jpg');
    background-position: center;
    background-size: cover;

    display: flex;

    width: 100%;
    height: 100%;

    padding: 0;
    margin: 0;
`

const Overlay = styled.div`
    background: rgba(0, 0, 0, 0.72);

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

const Container = styled.div`
    transition: 0.1s ease-out;

    flex-basis: 100%;

    display: flex;

    flex-direction: column;
    flex: 1 0 auto;

    position: relative;
    box-sizing: border-box;

    max-width: 360px;
    margin: auto;

    align-self: center;

    padding: 16px;

    @media (min-width: 768px)
    {
        max-width: 420px;
        padding: 32px;
    }
`

const Header = styled.div`
    padding: 16px 12px 32px;
`

const Title = styled.h1`
    /* font-family: 'Sarabun', sans-serif; */
    font-size: 36px;

    font-weight: 800;

    line-height: 1;

    margin: 0;
    padding: 0;

    color: white;
    text-align: left;

    text-shadow: 1px 3px 5px rgba(0,0,0,0.5);

    span
    {
        font-weight: 400;
    }

    @media (min-width: 768px)
    {
        font-size: 44px;
    }
`

const Subtitle = styled.h6`
    /* font-family: 'Sarabun', sans-serif; */
    font-size: 14px;

    font-weight: 300;

    line-height: 1;

    text-shadow: 1px 3px 5px rgba(0,0,0,0.5);

    margin: 6px 0 0 1px;
    padding: 0;

    color: white;
    text-align: left;
`

const Footer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    div
    {
        width: 320px;
        margin: 0 auto;

        font-size: 10px;

        padding-bottom: 8px;

        text-align: center;
    }
`

function Comp ({ children })
{
    return (
        <Background>
            <Overlay>
                <Container>
                    <Header>
                        <Title>CLEVER <span>MATH</span></Title>
                        <Subtitle>ระบบจัดการออนไลน์</Subtitle>
                    </Header>
                    {children}
                </Container>
                <Footer>
                </Footer>
            </Overlay>
        </Background>
    )
}

export default Comp