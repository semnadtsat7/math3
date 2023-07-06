import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { Button, Modal } from 'antd'
// import Collection from '../../utils/Collection'
import Menu from '../components/Menu'

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

function Comp (
    {
        actions = [], addAction, removeAction
    }
)
{
    const disabled = actions.length > 0

    const handlePublish = async () =>
    {
        addAction ('publishing')
        
        // const src = `${window.config.space}/admin/maps`
        // const dst = `${window.config.space}/school/maps`

        // const onFilter = ({ data }) => !!data.title

        // await Collection.publish ({ src, dst, onFilter })

        // const url = window.testconfig.url.maps.publish
        const url = "https://asia-east2-clever-math-hkg.cloudfunctions.net/admin-maps?action=publish"
        
        await axios.post (url)

        removeAction ('publishing')
    }
    
    return (
        <Container>
            {/* <Menu /> */}
            <Titlebar>
                <h2 className="primary">จัดการบทเรียน</h2>
                <span className="secondary" >ข้อมูลจะถูกบันทึกอัตโนมัติ</span>
            </Titlebar>
            <Button
                type="primary"
                disabled={disabled}
                loading={actions.indexOf ('publishing') >= 0}
                onClick={() =>
                    {
                        const m = Modal.confirm(
                            {
                                title: `ต้องการเผยแพร่ ?`,
                                okButtonProps: { type: 'primary' },
                                okText: 'ใช่',
                                cancelText: 'ไม่ใช่',
                                onOk: () => 
                                {
                                    handlePublish ()
                                    m.destroy ()
                                },
                            }
                        )
                    }}
            >
                เผยแพร่
            </Button>
        </Container>
    )
}

export default Comp