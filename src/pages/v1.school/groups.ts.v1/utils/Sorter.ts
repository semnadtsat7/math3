import { Group, Total } from '../listenGroups';
import NumberUtil from '../../../../utils/NumberTS';

export type Sort =
  {
    orderBy: string;
    order: string;
  }

export function load ()
{
  const ss = window.sessionStorage;

  const orderBy = ss.getItem('groups.orderBy') || 'name';
  const order = ss.getItem('groups.order') || 'asc';

  return {
    orderBy,
    order,
  } as Sort;
}

export function set (orderBy: string, order: string)
{
  const ss = window.sessionStorage;

  ss.setItem('groups.orderBy', orderBy);
  ss.setItem('groups.order', order);
}

export function sort (groups: Group[], { orderBy, order }: Sort, total: Total)
{
  function getScore (value?: number)
  {
    if (value)
    {
      return value;
    }

    return Number.MIN_SAFE_INTEGER;
  }

  let result = groups.sort(
    (a, b) => 
    {
      if (order === 'asc')
      {
        return a._id.localeCompare(b._id);
      }

      return b._id.localeCompare(a._id);
    }
  );

  if (orderBy === 'name' || orderBy === 'teacher')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => (a[orderBy] || '').localeCompare(b[orderBy] || ''))
    }
    else
    {
      result = result.sort((a, b) => (b[orderBy] || '').localeCompare(a[orderBy] || ''))
    }
  }
  else if (orderBy === 'student' || orderBy === 'best' || orderBy === 'pass' || orderBy === 'play' || orderBy === 'hint' || orderBy === 'help' || orderBy === 'usageAvg')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => getScore(a.metrics ? a.metrics[orderBy] : 0) - getScore(b.metrics ? b.metrics[orderBy] : 0));
    }
    else
    {
      result = result.sort((a, b) => getScore(b.metrics ? b.metrics[orderBy] : 0) - getScore(a.metrics ? a.metrics[orderBy] : 0));
    }
  }
  
  if (orderBy === 'best')
  {
    const max = total?.quiz * 3;

    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.best, max) - NumberUtil.percentage(b.metrics?.best, max));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.best, max) - NumberUtil.percentage(a.metrics?.best, max));
    }
  }
  else if (orderBy === 'pass')
  {
    const max = total?.quiz;

    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.pass, max) - NumberUtil.percentage(b.metrics?.pass, max));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.pass, max) - NumberUtil.percentage(a.metrics?.pass, max));
    }
  }

  return result;
}