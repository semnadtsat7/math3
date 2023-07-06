import React from 'react'
import styled from 'styled-components'

// import BackgroundURL from './pages/v3.sign-in/images/bg-01.jpg'
const BackgroundURL = `/images/bg-01.jpg`;

const Background = styled.div`
    background: url(${BackgroundURL});
    background-position: center;
    background-size: cover;

    display: flex;

    width: 100%;
    height: 100%;

    padding: 0;
    margin: 0;
`

function Page ()
{
    return (
        <Background />
    )
}

export default Page