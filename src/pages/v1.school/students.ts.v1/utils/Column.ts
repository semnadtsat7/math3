const KEY = 'students.columns';
const DEFAULT_COLUMNS: Columns =
{
  'teacher': true,
  'customId': true,
  'best': true,
  'play': true,
  'pass': true,
  'hint': false,
  'help': false,
  // 'hintHelp': false,
  'usageAvg': true,
  'lastSignedInAt': true,
}

export const COLUMN_TITLES = 
{
  'teacher': 'ระดับชั้น',
  'customId': 'รหัสนักเรียน',
  'pass': 'ด่านที่ผ่าน',
  'best': 'คะแนนรวม',
  'play': 'ทำข้อสอบ',
  'usageAvg': 'เวลาเฉลี่ยต่อข้อ',
  'hint': 'ใช้คำใบ้',
  'help': 'ใช้ตัวช่วย',
  // 'hintHelp': 'ใช้ตัวช่วยและคำใบ้',
  'lastSignedInAt': 'เข้าสู่ระบบล่าสุด',
};

export const COLUMN_FILTERABLES = Object.keys(COLUMN_TITLES).map(key => 
  {
    return {
      id: key,
      name: (COLUMN_TITLES as any)[key],
    };
  }
);

export type Columns = 
  {
    'teacher': boolean,
    'customId': boolean,
    'best': boolean,
    'play': boolean,
    'pass': boolean,
    'hint': boolean,
    'help': boolean,
    // 'hintHelp': boolean,
    'usageAvg': boolean,
    'lastSignedInAt': boolean,
  };

export function load ()
{
  const ls = window.localStorage;
  const json = JSON.parse(ls.getItem(KEY) ?? '{}');

  const columns: any = {};

  for (const key in COLUMN_TITLES) 
  {
    if (typeof json[key] === 'boolean')
    {
      columns[key] = json[key];
    }
    else
    {
      columns[key] = !!(DEFAULT_COLUMNS as any)[key];
    }
  }

  return columns as Columns;
}

export function set (value: Columns)
{
  const ls = window.localStorage;

  ls.setItem(KEY, JSON.stringify(value));
}