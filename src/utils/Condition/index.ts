
export function orTrue (...data: any[])
{
  for (const e of data) 
  {
    if (!!e)
    {
      return true;
    }
  }

  return false;
}