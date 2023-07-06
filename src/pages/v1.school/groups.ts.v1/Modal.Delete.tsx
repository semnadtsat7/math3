import React, { useState } from 'react'

import
{
  Modal,
  message,
} from 'antd'

import Firebase from '../../../utils/Firebase'

interface Props 
{
  spaceID: string;
  group:
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
    group,

    open,
    onClose,
  }
) =>
{
  const [saving, setSaving] = useState(false)

  async function handleSubmit ()
  {
    setSaving(true)

    try
    {
      const teacher = spaceID
      const { _id, name } = group

      const data = { teacher, group: _id }
      await Firebase.functions().httpsCallable('teacher-group-delete')(data)

      setSaving(false)

      if (typeof onClose === 'function')
      {
        onClose()
      }

      message.success(`ลบ "${name}" เรียบร้อยแล้ว`, 3)
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

    if (typeof onClose === 'function')
    {
      onClose()
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