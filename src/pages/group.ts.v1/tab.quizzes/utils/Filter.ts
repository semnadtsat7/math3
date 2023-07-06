export type Filter = 
  {
    sheetID: string;
    title: 'none' | string;
    level: 'none' | 'tutorial' | 'easy' | 'normal' | 'hard';
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const sheetID = ss.getItem('sheet') || 'none';
  const title = ss.getItem(`quizzes.title.${sheetID}`) || 'none';
  const level = ss.getItem(`quizzes.level`) || 'none';

  return {
    sheetID,
    title,
    level,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  
  const sheetID = filter.sheetID || 'none';
  const title = filter.title || 'none';
  const level = filter.level || 'none';

  ss.setItem('sheet', sheetID);
  ss.setItem('quizzes.sheet', sheetID);
  ss.setItem(`quizzes.title.${sheetID}`, title);
  ss.setItem(`quizzes.level`, level);
}