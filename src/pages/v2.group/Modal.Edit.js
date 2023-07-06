import React, { useState, useEffect } from 'react'

import {
    Modal,
    Form,
    Input,

    message,
} from 'antd'

import Firebase from '../../utils/Firebase'

function Comp (
    {
        space,
        group,

        defaultName,

        open,
        onClose,
    }
)
{
    const [ saving, setSaving ] = useState ('')
    const [ name, setName ] = useState ('')

    const invalid = []

    if (!name || name.length > 50)
    {
        invalid.push ('name')
    }

    const canSave = invalid.length === 0

    async function handleSubmit (e)
    {
        setSaving (true)

        try
        {
            const teacher = space
            const fields = { name }
            
            await Firebase.functions().httpsCallable('teacher-group-update')({ teacher, group, fields })

            setSaving (false)
            setName ('')

            if (typeof onClose === 'function')
            {
                onClose (e)
            }

            message.success ('บันทึกข้อมูลกลุ่มเรียนเรียบร้อยแล้ว', 3)
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

        setName ('')

        if (typeof onClose === 'function')
        {
            onClose (e)
        }
    }

    function handleOpen ()
    {
        if (!!open)
        {
            setName (defaultName || '')
        }
    }

    useEffect (handleOpen, [ open ])

    return (
        <Modal
            zIndex={10000}
            visible={open}
            title="แก้ไขข้อมูลกลุ่มเรียน"
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="บันทึก"
            cancelText="ปิด"
            okButtonProps={{ disabled: !canSave, loading: !!saving }}
            cancelButtonProps={{ disabled: !!saving }}
            closable={!saving}
        >
            <Form layout="vertical" >
                <Form.Item 
                    colon={false} 
                    label="ชื่อกลุ่มเรียน"
                >
                    <Input 
                        type="text"
                        maxLength={50}
                        disabled={!!saving}
                        value={name}
                        onChange={e => setName (e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Comp