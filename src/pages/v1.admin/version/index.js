import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import firebase from 'firebase'
import axios from 'axios'
import Parent from "../../../components/Parent";

import { Input, Button } from 'antd'

import Header from './Header'

const Container = styled.div`
    padding: 16px;
`

function PageVersion ()
{
    const parent = useRef(Parent);
    const [ action, setAction ] = useState ('loading')
    const [ build, setBuild ] = useState ('1.00')

    const disabled = !!action

    function handleMount ()
    {
        setAction ('loading')

        const rdb = firebase.database ()
        const ref = rdb.ref (`version/build`)

        function onSnapshot (snapshot)
        {
            setBuild (snapshot.exists () ? snapshot.val () : `1.00`)
            setAction (false)
        }

        ref.on ('value', onSnapshot)

        return function ()
        {
            ref.off ('value', onSnapshot)
        }
    }

    function handleChange (e)
    {
        setBuild (e.target.value.replace (/[^0-9.]/gi, ''))
    }

    async function handleSave ()
    {
        setAction ('saving')

        const rdb = firebase.database ()
        const ref = rdb.ref (`version/build`)

        const url = `https://us-central1-clevermath-official.cloudfunctions.net/v2-webhookBuild`
        
        await Promise.all (
            [
                ref.set (build),
                axios.post (url, { version: build }),
            ]
        )

        setAction (false)
    }

    useEffect (handleMount, [ ])

    return (
        <Parent ref={parent}>
        <div>
            <Header />
            <Container>
            {
                action === 'loading' ?
                `กำลังโหลด...`
                :
                <>
                    <Input 
                        type="text"
                        value={build}
                        disabled={disabled}
                        onChange={handleChange}
                        placeholder="#.##"
                        maxLength={9}
                    />
                    <div style={{ height: 16 }} />
                    <Button
                        type="primary"
                        disabled={disabled}
                        onClick={handleSave}
                    >
                        {action === 'saving' ? 'กำลังบันทึก' : 'บันทึก'}
                    </Button>
                </>
            }
            </Container>
        </div>
        </Parent>
    )
}

export default PageVersion