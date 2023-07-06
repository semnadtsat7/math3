import { Sheet } from '../listenSummary';
import NumberUtil from '../../../../utils/NumberTS';

export type Sort =
  {
    orderBy: string;
    order: string;
  }

export function load ()
{
  const ss = window.sessionStorage;

  const orderBy = ss.getItem('student-summary-by-sheets.orderBy') || 'order';
  const order = ss.getItem('student-summary-by-sheets.order') || 'asc';

  return {
    orderBy,
    order,
  } as Sort;
}

export function set (orderBy: string, order: string)
{
  const ss = window.sessionStorage;

  ss.setItem('student-summary-by-sheets.orderBy', orderBy);
  ss.setItem('student-summary-by-sheets.order', order);
}

export function sort (sheets: Sheet[], { orderBy, order }: Sort)
{
  function getNumber (value?: number)
  {
    if (value)
    {
      return value;
    }

    return Number.MIN_SAFE_INTEGER;
  }

  let result = sheets.sort(
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
      result = result.sort((a, b) => getNumber(a.index) - getNumber(b.index));
    }
    else
    {
      result = result.sort((a, b) => getNumber(b.index) - getNumber(a.index));
    }
  }
  else if (orderBy === 'updatedAt')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => getNumber(a.updatedAt) - getNumber(b.updatedAt));
    }
    else
    {
      result = result.sort((a, b) => getNumber(b.updatedAt) - getNumber(a.updatedAt));
    }
  }
  else if (orderBy === 'best' || orderBy === 'pass' || orderBy === 'play' || orderBy === 'hint' || orderBy === 'help' || orderBy === 'usageAvg')
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
    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.best, a.metrics?.quiz * 3) - NumberUtil.percentage(b.metrics?.best, b.metrics?.quiz * 3));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.best, b.metrics?.quiz * 3) - NumberUtil.percentage(a.metrics?.best, a.metrics?.quiz * 3));
    }
  }
  else if (orderBy === 'pass')
  {
    if (order === 'asc')
    {
      result = result.sort((a, b) => NumberUtil.percentage(a.metrics?.pass, a.metrics?.quiz) - NumberUtil.percentage(b.metrics?.pass, b.metrics?.quiz));
    }
    else
    {
      result = result.sort((a, b) => NumberUtil.percentage(b.metrics?.pass, b.metrics?.quiz) - NumberUtil.percentage(a.metrics?.pass, a.metrics?.quiz));
    }
  }

  return result;
}