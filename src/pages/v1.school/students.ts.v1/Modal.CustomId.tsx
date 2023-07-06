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
  student:
  {
    _id?: string;
    name?: string;
  },

  open: boolean;
  onClose: Function;
}

const Comp: React.FC<Props> = (
  {
    spaceID,
    student,

    open,
    onClose,
  }
) =>
{
  const [saving, setSaving] = useState(false);
  const [customId, setCustomID] = useState('')

  const invalid = []

  if (!customId || customId.length > 50)
  {
    invalid.push('customId')
  }

  const canSave = invalid.length === 0

  async function handleSubmit ()
  {
    setSaving(true)

    try
    {
      const teacher = spaceID;
      const { _id, name } = student;

      const data = { teacher, student: _id, customId };
      await Firebase.functions().httpsCallable('teacher-student-update')(data)

      setSaving(false)
      setCustomID('')

      if (typeof onClose === 'function')
      {
        onClose()
      }

      message.success(`บันทึกรหัสนักเรียนของ ${name} เรียบร้อยแล้ว`, 3)
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

    setCustomID('')

    if (typeof onClose === 'function')
    {
      onClose()
    }
  }

  return (
    <Modal
      zIndex={10000}
      visible={open}
      title={`กรุณาระบุรหัสนักเรียนของ ${student.name || ''}`}
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
          label="รหัสนักเรียน"
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