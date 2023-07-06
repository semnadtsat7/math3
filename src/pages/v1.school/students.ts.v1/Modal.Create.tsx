import React, { useState } from 'react'

import
{
  Modal,
  Form,
  Input,

  message,
} from 'antd'

import Firebase from '../../../utils/Firebase'

interface Props
{
  spaceID: string;

  open: boolean;
  onClose: Function;
}

const Comp: React.FC<Props> = (
  {
    spaceID,

    open,
    onClose,
  }
) =>
{
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('')
  const [customId, setCustomID] = useState('')

  const invalid = []

  if (!name || name.length > 50)
  {
    invalid.push('name')
  }

  const canSave = invalid.length === 0

  async function handleSubmit ()
  {
    setSaving(true)

    try
    {
      const teacher = spaceID;
      await Firebase.functions().httpsCallable('teacher-student-create')({ teacher, name, customId })

      setSaving(false)
      setName('')
      setCustomID('')

      if (typeof onClose === 'function')
      {
        onClose()
      }

      message.success('สร้างนักเรียนใหม่เรียบร้อยแล้ว', 3)
    }
    catch (err)
    {
      console.log(err)

      setSaving(false)

      message.error('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
    }
  }

  function handleCancel ()
  {
    if (!!saving)
    {
      return
    }

    setName('')
    setCustomID('')

    if (typeof onClose === 'function')
    {
      onClose();
    }
  }

  return (
    <Modal
      zIndex={10000}
      visible={open}
      title="กรุณาระบุข้อมูลของนักเรียน"
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="สร้าง"
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
            onChange={e => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          colon={false}
          label="รหัสนักเรียน (เพิ่มภายหลังได้)"
        >
          <Input
            type="text"
            maxLength={50}
            disabled={!!saving}
            value={customId}
            onChange={e => setCustomID(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Comp