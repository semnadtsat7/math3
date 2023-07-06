import { Quiz, Total } from '../listenSummary';
import NumberUtil from '../../../../utils/NumberTS';

export type Sort =
  {
    orderBy: string;
    order: string;
  }

export function load ()
{
  const ss = window.sessionStorage;

  const orderBy = ss.getItem('group-summary-by-quizzes.orderBy') || 'order';
  const order = ss.getItem('group-summary-by-quizzes.order') || 'asc';

  return {
    orderBy,
    order,
  } as Sort;
}

export function set (orderBy: string, order: string)
{
  const ss = window.sessionStorage;

  ss.setItem('group-summary-by-quizzes.orderBy', orderBy);
  ss.setItem('group-summary-by-quizzes.order', order);
}

export function sort (quizzes: Quiz[], { orderBy, order }: Sort, total: Total)
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

  if (orderBy === 'level')
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
  else if (orderBy === 'best' || orderBy === 'playDistinct' || orderBy === 'play' || orderBy === 'hint' || orderBy === 'help' || orderBy === 'usageAvg')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => getNumber(a.metrics ? a.metrics[orderBy] : 0) - getNumber(b.metrics ? b.metrics[orderBy] : 0));
    }
    else
    {
      result = result.sort((a, b) => getNumber(b.metrics ? b.metrics[orderBy] : 0) - getNumber(a.metrics ? a.metrics[orderBy] : 0));
    }
  }
  
  if (orderBy === 'best')
  {
    const max = 3;

    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.best, max) - NumberUtil.percentage(b.metrics?.best, max));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.best, max) - NumberUtil.percentage(a.metrics?.best, max));
    }
  }
  else if (orderBy === 'playDistinct')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.playDistinct, total?.student) - NumberUtil.percentage(b.metrics?.playDistinct, total?.student));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.playDistinct, total?.student) - NumberUtil.percentage(a.metrics?.playDistinct, total?.student));
    }
  }

  return result;
}