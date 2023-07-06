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
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')

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
      const teacher = spaceID
      await Firebase.functions().httpsCallable('teacher-group-create')({ teacher, name })

      setSaving(false)
      setName('')

      if (typeof onClose === 'function')
      {
        onClose()
      }

      message.success('สร้างกลุ่มเรียนใหม่เรียบร้อยแล้ว', 3)
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

    if (typeof onClose === 'function')
    {
      onClose()
    }
  }

  return (
    <Modal
      zIndex={10000}
      visible={open}
      title="กรุณาระบุข้อมูลของกลุ่มเรียน"
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
          label="ชื่อกลุ่มเรียน"
        >
          <Input
            type="text"
            maxLength={50}
            disabled={!!saving}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Comp