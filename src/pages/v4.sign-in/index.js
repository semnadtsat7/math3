import React, { useState } from 'react';
import querystring from 'querystring';

import Container from './Container'

import SignIn from './SignIn'
import SignUp from './SignUp'

function Page ()
{
    const query = querystring.parse(window.location.search.slice(1));
    const isSignUp = query.tab === 'hidden-signup-for-admin';

    const [ tab, setTab ] = useState (isSignUp ? 'signup' : 'signin');

    return (
        <Container>
            {
                tab === 'signin' &&
                <SignIn onSignUpClick={() => setTab ('signup')} />
            }
            {
                tab === 'signup' &&
                <SignUp onSignInClick={() => setTab ('signin')} />
            }
        </Container>
    )
}

export default Page