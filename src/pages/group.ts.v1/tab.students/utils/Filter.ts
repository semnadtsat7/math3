import moment from 'moment';

export type Filter = 
  {
    sheetID: string;
    quizID: string;

    title: string;
    scope: string;

    startAt: number;
    endAt: number;
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const sheetID = ss.getItem('quizzes.sheet') || 'none';
  const quizID = ss.getItem('quizzes.quiz') || 'none';
  const scope = ss.getItem('quizzes.scope') || 'active';
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
    sheetID,
    quizID,

    title,
    scope,

    startAt,
    endAt,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  
  const sheetID = filter.sheetID || 'none';
  const quizID = filter.quizID || 'none';
  const title = filter.title || 'none';
  const scope = filter.scope || 'none';

  if (sheetID !== 'none')
  {
    ss.setItem('sheet', sheetID);
  }

  ss.setItem('quizzes.sheet', sheetID);
  ss.setItem('quizzes.quiz', quizID);
  ss.setItem('quizzes.scope', scope);
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