import { Modal, message } from 'antd';
import axios from 'axios';
import querystring from 'querystring';

import { Parser as J2CParser } from 'json2csv';
import JFile from 'js-file-download';

export default async function ()
{
  const m = Modal.confirm({
    title: 'ต้องการดาวโหลด "ข้อมูลความก้าวหน้าทุกสายชั้น" ?',
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
    name: 'sheets-progress',
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

  const file = `ความก้าวหน้า - ${YYYY}${MM}${DD}-${HH}${mm}${ss}.csv`;
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
        items.push({
          email: user.email,
          space_id: space.id,
          space_name: space.name,
          group_id: group.id,
          group_name: group.name,
          metrics_pass: group.metrics?.pass || 0,
          metrics_quiz: group.metrics?.quiz || 0,
        });  
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
      label: 'จำนวนด่านที่ผ่าน',
      value: 'metrics_pass',
    },
    {
      label: 'จำนวนด่านทั้งหมด',
      value: 'metrics_quiz',
    },
  ];

  return fields;
}