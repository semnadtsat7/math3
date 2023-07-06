const KEY = 'student-summary-by-quizzes.columns';
const DEFAULT_COLUMNS: Columns =
{
  'level': true,
  'best': true,
  'play': true,
  'usageAvg': true,
  'hint': false,
  'help': false,
  'bestAt': true,
}

export const COLUMN_TITLES = 
{
  'level': 'ระดับ',
  'best': 'คะแนน',
  'play': 'ทำข้อสอบ',
  'usageAvg': 'เวลาเฉลี่ยต่อข้อ',
  'hint': 'ใช้คำใบ้',
  'help': 'ใช้ตัวช่วย',
  'bestAt': 'เวลาที่บันทึกคะแนนที่ดีที่สุด',
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
    'level': boolean,
    'best': boolean,
    'play': boolean,
    'usageAvg': boolean,
    'hint': boolean,
    'help': boolean,
    'bestAt': boolean,
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