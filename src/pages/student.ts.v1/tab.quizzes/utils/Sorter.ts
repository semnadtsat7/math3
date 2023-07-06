import { Quiz } from '../listenSheet';

export type Sort =
  {
    orderBy: string;
    order: string;
  }

export function load ()
{
  const ss = window.sessionStorage;

  const orderBy = ss.getItem('*-quizzes.orderBy') || 'order';
  const order = ss.getItem('*-quizzes.order') || 'asc';

  return {
    orderBy,
    order,
  } as Sort;
}

export function set (orderBy: string, order: string)
{
  const ss = window.sessionStorage;

  ss.setItem('*-quizzes.orderBy', orderBy);
  ss.setItem('*-quizzes.order', order);
}

export function sort (quizzes: Quiz[], { orderBy, order }: Sort)
{
  function getNumber (value?: number)
  {
    if (value)
    {
      return value;
    }

    return Number.MIN_SAFE_INTEGER;
  }

  function getLevel (value: string)
  {
    if (value === 'tutorial')
    {
      return -1;
    }
    else if (value === 'easy')
    {
      return 0;
    }
    else if (value === 'normal')
    {
      return 1;
    }

    return 2;
  }

  let result = quizzes.sort(
    (a, b) => 
    {
      if (order === 'asc')
      {
        return a._id.localeCompare(b._id);
      }

      return b._id.localeCompare(a._id);
    }
  );

  if (orderBy === 'order')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => getNumber(a.order) - getNumber(b.order));
    }
    else
    {
      result = result.sort((a, b) => getNumber(b.order) - getNumber(a.order));
    }
  }
  else if (orderBy === 'level')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => getLevel(a.level) - getLevel(b.level));
    }
    else
    {
      result = result.sort((a, b) => getLevel(b.level) - getLevel(a.level));
    }
  }

  return result;
}