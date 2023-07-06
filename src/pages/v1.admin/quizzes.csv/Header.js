import React from 'react'
import styled from 'styled-components'

//import Menu from '../../components/Menu'

const Container = styled.div`
    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;
    
    align-items: center;

    padding: 8px 16px 16px;
`

const Titlebar = styled.div`
    display: flex;

    flex-direction: column;
    flex-wrap: nowrap;
    flex-grow: 1;

    .primary
    {
        /* margin: 0 0 8px 0; */
        margin: 0;
        padding: 0;
    }

    .secondary
    {
        display: flex;

        flex-direction: row;
        flex-wrap: nowrap;

        color: #999;

        font-size: 0.9em;
    }
`

function Comp ()
{
    return (
        <Container>
            {/* <Menu /> */}
            <Titlebar>
                <h2 className="primary">จัดการข้อสอบ</h2>
                <span className="secondary" >เมื่ออัปโหลดแล้วข้อสอบจะถูกเผยแพร่อัตโนมัติ</span>
            </Titlebar>
        </Container>
    )
}

export default Comp