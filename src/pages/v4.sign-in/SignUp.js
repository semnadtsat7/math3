import React, { useState } from 'react'

import styled from 'styled-components'
import firebase from 'firebase/app'

import { Rule } from '@cesium133/forgjs'
import { message } from 'antd'

import Email from './Input.Email'
import Password from './Input.Password'
import Submit from './Submit'
// import Back from './Back';

const Form = styled.form`

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    width: 100%;
`

const Texts = 
{
    signing: 'กำลังสร้างบัญชีใหม่',
}

function Page (
    {
        onSignInClick,
    }
)
{
    const [ email, setEmail ] = useState ('')
    const [ password, setPassword ] = useState ('')

    const [ errors, setErrors ] = useState ([])
    const [ status, setStatus ] = useState (null)

    async function handleSubmit (e)
    {
        e.preventDefault ()
        setErrors ([])

        await new Promise (r => setTimeout(r, 100))

        const emailRule = new Rule(
            {
                type: 'email',
                notEmpty: true,
            }
        )

        const passwordRule = new Rule(
            {
                type: 'password', // 6May2021 (Commented by Sornpakorn.S) Set to integer, not password, because admin still need to control teacher account. Admin need to know teachers' password (10 int mobile phone number).
								numbers: 10,
                minLength: 10,
                maxLength: 10,
            }
        )
        
        const errors = []

        const isEmailValid = emailRule.test (email)
        const isPasswordValid = passwordRule.test (password)

        if (!isEmailValid)
        {
            errors.push('email')
        }

        if (!isPasswordValid)
        {
            errors.push('password')
        }

        if (errors.length > 0)
        {
            setErrors (errors)
            setStatus ('error')

            return
        }

        setErrors ([])
        setStatus ('signing')
        
        const auth = firebase.auth ()
        const callback = () =>
        {
            auth
            .createUserWithEmailAndPassword(email, password)
            .then (() =>
            {
                window.localStorage.removeItem ('space')
                window.localStorage.removeItem ('spaces')
                window.location.reload ();

                // auth
                // .currentUser
                // .getIdToken ()
                // .then (token =>
                // {
                //     // Do Nothing . . .
                // });
            })
            .catch (err =>
            {
                errors.push('email')
                errors.push('password')

                setErrors (errors)
                setStatus ('error')

                message.error ('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
            })
        }

        auth
        .setPersistence (firebase.auth.Auth.Persistence.LOCAL)
        .then (callback)
        .catch (err =>
        {
            errors.push('email')
            errors.push('password')

            setErrors (errors)
            setStatus ('error')

            message.error ('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        })
    }

    const signing = status === 'signing' 
    const sending = status === 'sending' 
    const error = status === 'error' 

    const loading = signing || sending

    return (
        <Form onSubmit={handleSubmit}>
            <Email  
                defaultValue={email}
                onChange={setEmail}
                error={error && errors.indexOf ('email') >= 0}
                disabled={loading}
            />
            <Password 
                defaultValue={password}
                onChange={setPassword}
                error={error && errors.indexOf ('password') >= 0}
                disabled={loading}
            />
            <Submit 
                // error={error}
                text="สร้างบัญชีครู"
                loading={loading}
                loadingText={Texts[status]}
            />
            {/* <Back 
                loading={loading}
                onClick={onSignInClick}
            /> */}
        </Form>
    )
}

export default Page