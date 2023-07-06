const KEY = 'student-summary-by-sheets.columns';
const DEFAULT_COLUMNS: Columns =
{
  'best': true,
  'play': true,
  'pass': true,
  'usageAvg': true,
  'hint': false,
  'help': false,
  'updatedAt': true,
}

export const COLUMN_TITLES = 
{
  'pass': 'ด่านที่ผ่าน',
  'best': 'คะแนนรวม',
  'play': 'ทำข้อสอบ',
  'usageAvg': 'เวลาเฉลี่ยต่อข้อ',
  'hint': 'ใช้คำใบ้',
  'help': 'ใช้ตัวช่วย',
  'updatedAt': 'ทำข้อสอบล่าสุด',
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
    'best': boolean,
    'play': boolean,
    'pass': boolean,
    'usageAvg': boolean,
    'hint': boolean,
    'help': boolean,
    'updatedAt': boolean,
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