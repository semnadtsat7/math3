import { Modal, message } from 'antd';
import axios from 'axios';
import querystring from 'querystring';

import { Parser as J2CParser } from 'json2csv';
import JFile from 'js-file-download';

export default async function ()
{
  const m = Modal.confirm({
    title: 'ต้องการดาวโหลด "ข้อมูลความก้าวหน้าแบบละเอียดทุกสายชั้น" ?',
    content: 'ข้อมูลมีปริมาณมาก อาจจะใช้เวลาในการเตรียมข้อมูลนาน',
    cancelText: 'ยกเลิก',
    okText: 'ดาวโหลด',
    onOk: async () => {
      m.update({ cancelButtonProps: { style: { display: 'none' } } });
      await download();
    },
    keyboard: false,
    maskClosable: false,
  });
}

async function download ()
{
  const url = `https://us-central1-clevermath-app.cloudfunctions.net/admin`;
  const data = {
    name: 'quizzes-progress',
    token: querystring.parse(window.location.search.slice(1))?.token
  };

  const res = await axios.post(url, { data });
  const { $read, items } = res.data?.result;

  console.log('read', $read);

  const fields = getFields();
  const rows = getRows(items);

  const now = new Date();

  const YYYY = now.getFullYear();
  const MM = (now.getMonth() + 1).toString(10).padStart(2, '0');
  const DD = now.getDate().toString(10).padStart(2, '0');
  const HH = now.getHours().toString(10).padStart(2, '0');
  const mm = now.getMinutes().toString(10).padStart(2, '0');
  const ss = now.getSeconds().toString(10).padStart(2, '0');

  const file = `ความก้าวหน้าแบบละเอียด - ${YYYY}${MM}${DD}-${HH}${mm}${ss}.csv`;
  const csv = new J2CParser({ withBOM: true, fields }).parse(rows);

  JFile(csv, file, 'text/csv');
  
  message.success('ดาวน์โหลดข้อมูลสำเร็จ', 3);
}

function getRows (users)
{
  const items = [];
  const sorteds = users.sort((a, b) => a.email.localeCompare(b.email));

  for (const user of sorteds)
  {
    const spaces = user.spaces.sort((a, b) => a.name.localeCompare(b.name));

    for (const space of spaces)
    {
      const groups = space.groups.sort((a, b) => a.name.localeCompare(b.name));
  
      for (const group of groups)
      {
        const sheets = group.sheets.sort((a, b) => a.title.localeCompare(b.title));

        for (const sheet of sheets)
        {
          const quizzes = sheet.quizzes.sort((a, b) => a.order - b.order);

          for (const quiz of quizzes)
          {
            items.push({
              email: user.email,
              space_id: space.id,
              space_name: space.name,
              group_id: group.id,
              group_name: group.name,
              sheet_title: sheet.title,
              quiz_order: quiz.order,
              quiz_title: quiz.title,
              quiz_level: quiz.level,
              metrics_best: quiz.metrics?.best || 0,
              metrics_play: quiz.metrics?.play || 0,
              metrics_usage: quiz.metrics?.usage || 0,
              metrics_hint: quiz.metrics?.hint || 0,
              metrics_help: quiz.metrics?.help || 0,
            });
          }
        }
      }
    }
  }

  return items;
}

function getFields ()
{
  const fields = [
    {
      label: 'อีเมล',
      value: 'email',
    },
    {
      label: 'ไอดีสายชั้น',
      value: 'space_id',
    },
    {
      label: 'ชื่อสายชั้น',
      value: 'space_name',
    },
    {
      label: 'ไอดีกลุ่มเรียน',
      value: 'group_id',
    },
    {
      label: 'ชื่อกลุ่มเรียน',
      value: 'group_name',
    },
    {
      label: 'บทเรียน',
      value: 'sheet_title',
    },
    {
      label: 'ชุดที่',
      value: 'quiz_order',
    },
    {
      label: 'บทเรียนย่อย',
      value: 'quiz_title',
    },
    {
      label: 'ระดับ',
      value: 'quiz_level',
    },
    {
      label: 'คะแนนโดยเฉลี่ย (คะแนน)',
      value: 'metrics_best',
    },
    {
      label: 'ทำข้อสอบแล้ว (คน)',
      value: 'metrics_play',
    },
    {
      label: 'เวลาเฉลี่ยต่อข้อ (วินาที)',
      value: 'metrics_usage',
    },
    {
      label: 'ใช้คำใบ้ (ครั้ง)',
      value: 'metrics_hint',
    },
    {
      label: 'ใช้ตัวช่วย (ครั้ง)',
      value: 'metrics_help',
    },
  ];

  return fields;
}