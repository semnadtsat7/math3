export type Filter = 
  {
    sheetID: string;
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const sheetID = ss.getItem('quizzes.sheet') || 'none';

  return {
    sheetID,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  const sheetID = filter.sheetID || 'none';

  ss.setItem('quizzes.sheet', sheetID);
}