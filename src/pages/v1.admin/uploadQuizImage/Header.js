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

function Comp() {
    return (
        <Container>
            {/* <Menu /> */}
            <Titlebar>
                <h2 className="primary">อัพโหลดรูปข้อสอบ</h2>
                <h4 className="primary">วิธีใช้</h4>
                <li>เลือกรูปภาพที่ต้องการอัพโหลดลงฐานข้อมูล (สูงสุด 15 รูป)</li>
                <li>ด้านซ้ายจะเป็นรูปต้นฉบับ ด้านขวาจะเป็นรูปที่ทำการปรับปรุงแล้ว</li>
                <li>ให้เลือกรูปภาพที่สามารถมองเห็นชัดเจน และขนาดไฟล์น้อยกว่า</li>
                <li>กดปุ่ม อัพโหลดรูปทั้งหมด หลังจากนั้นระบบจะทำการอัพโหลดรูป</li>
            </Titlebar>
        </Container>
    )
}

export default Comp