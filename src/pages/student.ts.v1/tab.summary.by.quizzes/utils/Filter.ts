import { Quiz } from '../listenSummary';

export type Filter = 
  {
    title: 'none' | string;
    level: 'none' | 'tutorial' | 'easy' | 'normal' | 'hard';
    play: 'none' | 'ever' | 'never';
  };

export function load (title: string)//sheetID: string)
{
  const ss = window.sessionStorage;
  
  // const title = ss.getItem(`quizzes.title.${sheetID}`) || 'none';
  const level = ss.getItem(`quizzes.level`) || 'none';
  const play = ss.getItem(`quizzes.play`) || 'none';

  return {
    // title,
    title,
    level,
    play,
  } as Filter;
}

export function set (filter: Filter)//, sheetID: string)
{
  const ss = window.sessionStorage;
  
  // const title = filter.title || 'none';
  const level = filter.level || 'none';
  const play = filter.play || 'none';

  // ss.setItem(`quizzes.title.${sheetID}`, title);
  ss.setItem(`quizzes.level`, level);
  ss.setItem(`quizzes.play`, play);
}

export function exec (quizzes: Quiz[], filter: Filter)
{
  let result = quizzes;

  if (filter.title !== 'none')
  {
    result = result.filter(e => e.title === filter.title);
  }

  if (filter.level !== 'none')
  {
    result = result.filter(e => e.level === filter.level);
  }

  if (filter.play === 'ever')
  {
    result = result.filter(e => e.metrics && e.metrics.play > 0);
  }
  else if (filter.play === 'never')
  {
    result = result.filter(e => !e.metrics || e.metrics.play === 0);
  }

  return result;
}