export type Filter = 
  {
    range: string;
  };

export function load ()
{
  const ss = window.sessionStorage;
  
  const range = ss.getItem('dashboard.student.actives.range') || '1D';

  return {
    range,
  } as Filter;
}

export function set (filter: Filter)
{
  const ss = window.sessionStorage;
  const range = filter.range || '1D';

  ss.setItem('dashboard.student.actives.range', range);
}