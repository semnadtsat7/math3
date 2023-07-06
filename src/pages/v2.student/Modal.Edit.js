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
        student,

        defaultName,
        defaultCustomId,

        open,
        onClose,
    }
)
{
    const [ saving, setSaving ] = useState ('')

    const [ name, setName ] = useState ('')
    const [ customId, setCustomID ] = useState ('')

    const invalid = []

    if (!name || name.length > 50)
    {
        invalid.push ('name')
    }

    if (!!customId && customId.length > 50)
    {
        invalid.push ('customId')
    }

    const canSave = invalid.length === 0

    async function handleSubmit (e)
    {
        setSaving (true)

        try
        {
            const teacher = space
            await Firebase.functions().httpsCallable('teacher-student-update')({ teacher, student, name, customId })

            setSaving (false)
            setName ('')
            setCustomID ('')

            if (typeof onClose === 'function')
            {
                onClose (e)
            }

            message.success ('บันทึกข้อมูลนักเรียนเรียบร้อยแล้ว', 3)
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
        setCustomID ('')

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
            setCustomID (defaultCustomId || '')
        }
    }

    useEffect (handleOpen, [ open ])

    return (
        <Modal
            zIndex={10000}
            visible={open}
            title="แก้ไขข้อมูลนักเรียน"
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
                    label="ชื่อ - นามสกุล"
                >
                    <Input 
                        type="text"
                        maxLength={50}
                        disabled={!!saving}
                        value={name}
                        onChange={e => setName (e.target.value)}
                    />
                </Form.Item>

                <Form.Item 
                    colon={false} 
                    label="รหัสนักเรียน"
                >
                    <Input 
                        type="text"
                        maxLength={50}
                        disabled={!!saving}
                        value={customId}
                        onChange={e => setCustomID (e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Comp