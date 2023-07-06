import React, { useState } from 'react'

import {
    Modal,
    message,
} from 'antd'

import Firebase from '../../utils/Firebase'

function Comp (
    {
        space,
        group = {},

        open,
        onClose,
    }
)
{
    const [ saving, setSaving ] = useState ('')

    async function handleSubmit (e)
    {
        setSaving (true)

        try
        {
            const teacher = space
            const { id, name } = group

            const data = { teacher, group: id }
            await Firebase.functions().httpsCallable('teacher-group-delete')(data)

            setSaving (false)

            if (typeof onClose === 'function')
            {
                onClose (e)
            }

            message.success (`ลบ "${name}" เรียบร้อยแล้ว`, 3)
        }
        catch (err)
        {
            console.log (err)
            
            setSaving (false)

            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }
    }

    function handleCancel (e)
    {
        if (!!saving)
        {
            return
        }

        if (typeof onClose === 'function')
        {
            onClose (e)
        }
    }

    return (
        <Modal
            zIndex={10000}
            visible={open}
            title={`ต้องการลบ "${group.name || ''}" ?`}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="ลบ"
            cancelText="ปิด"
            okButtonProps={{ type: 'danger', loading: !!saving }}
            cancelButtonProps={{ disabled: !!saving }}
            closable={!saving}
        >
            <p>เมื่อลบไปแล้วจะไม่สามารถกู้คืนข้อมูลได้อีก</p>
        </Modal>
    )
}

export default Comp