
export type Filter = 
  {
    sheetID: string;
    title: string;
    field: string;
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const sheetID = ss.getItem('quizzes.sheet') || 'none';
  const title = ss.getItem(`quizzes.title.${sheetID}`) || 'none';
  const field = ss.getItem(`dashboard.scatter.field`) || 'playAvg';

  return {
    sheetID,
    title,
    field,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  
  const sheetID = filter.sheetID || 'none';
  const title = filter.title || 'none';
  const field = filter.field || 'playAvg';

  if (sheetID !== 'none')
  {
    ss.setItem('sheet', sheetID);
  }

  ss.setItem('quizzes.sheet', sheetID);
  ss.setItem(`quizzes.title.${sheetID}`, title);
  ss.setItem(`dashboard.scatter.field`, field);
}