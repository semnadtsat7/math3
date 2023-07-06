import moment from 'moment';

export type Filter = 
  {
    groupID: string;
    sheetID: string;

    title: string;

    startAt: number;
    endAt: number;
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const groupID = ss.getItem('group') || 'none';
  const sheetID = ss.getItem('quizzes.sheet') || 'none';
  const title = ss.getItem(`quizzes.title.${sheetID}`) || 'none';

  const _startAt = ss.getItem('startAt');
  const _endAt = ss.getItem('endAt');

  let startAt = typeof _startAt === 'string' ? parseInt(_startAt, 10) : undefined;
  let endAt = typeof _endAt === 'string' ? parseInt(_endAt, 10) : undefined

  const max = moment().endOf('day');

  if (!endAt || moment(endAt).endOf('day') > max)
  {
    endAt = max.valueOf();
  }

  const min = moment(endAt).subtract(1, 'year').startOf('day');

  if (!startAt || moment(startAt).startOf('day') < min)
  {
    startAt = min.valueOf();
  }

  return {
    groupID,
    sheetID,

    title,

    startAt,
    endAt,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  
  const groupID = filter.groupID || 'none';
  const sheetID = filter.sheetID || 'none';
  const title = filter.title || 'none';

  if (sheetID !== 'none')
  {
    ss.setItem('sheet', sheetID);
  }

  ss.setItem('group', groupID);
  ss.setItem('quizzes.sheet', sheetID);
  ss.setItem(`quizzes.title.${sheetID}`, title);
  
  if (filter.startAt)
  {
    ss.setItem('startAt', filter.startAt.toString(10));
  }
  else
  {
    ss.removeItem('startAt');
  }

  if (filter.endAt)
  {
    ss.setItem('endAt', filter.endAt.toString(10));
  }
  else
  {
    ss.removeItem('endAt');
  }
}