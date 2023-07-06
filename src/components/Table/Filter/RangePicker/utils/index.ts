import DateTimeUtil from '../../../../../utils/DateTime';

export function getDateString (value: number)
{
  return DateTimeUtil.formatDate(value, { monthType: 'short' });
}