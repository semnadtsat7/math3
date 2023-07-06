const D28 =   2419200000;
const D07 =    604800000;
const D01 =     86400000;
const H01 =      3600000;
const M15 =       900000;

function getTime (value)
{
  if (['string', 'number'].indexOf(typeof value) >= 0)
  {
    return new Date(value).getTime();
  }

  if (value && typeof value.toMillis === 'function')
  {
    return value.toMillis();
  }

  return null;
}

function extract (_startAt, _endAt)
{
  const startAt = getTime(_startAt);
  const endAt = getTime(_endAt);

  const a = startAt - (startAt % M15);
  const b = endAt - (endAt % M15);

  const fragments = [];
  
  for (let t = a; t <= b;)
  {
    // const txt = new Date(t).toUTCString();
    const dM15 = new Date(t);

    const YYYY = dM15.getUTCFullYear();
    const MM = dM15.getUTCMonth();
    const DD = dM15.getUTCDate();
    const HH = dM15.getUTCHours();
    const mm = dM15.getMinutes();

    const _MM = MM.toString(10).padStart(2, '0');
    const _DD = DD.toString(10).padStart(2, '0');
    const _HH = HH.toString(10).padStart(2, '0');
    const _mm = mm.toString(10).padStart(2, '0');

    if (t % D01 === 0 && t + D01 < b)
    {
      if (DD === 1 && t + D28 < b)
      {
        fragments.push(
          {
            type: 'D28',
            date: `${YYYY}${_MM}${'01'}`,
            // startAt: t,
            // endAt: t + D28 -1
          }
        );

        // console.log(txt, 'D28');
        t += D28;

        continue;
      }

      if ([ 1, 8, 15, 22 ].indexOf(DD) >= 0 && t + D07 < b)
      {
        fragments.push(
          {
            type: 'D07',
            date: `${YYYY}${_MM}${_DD}`,
            // startAt: t,
            // endAt: t + D07 -1
          }
        );

        // console.log(txt, 'D07');
        t += D07;

        continue;
      }

      fragments.push(
        {
          type: 'D01',
          date: `${YYYY}${_MM}${_DD}`,
          // startAt: t,
          // endAt: t + D01 -1
        }
      );

      // console.log(txt, 'D01');
      t += D01;
    }
    else if (t % H01 === 0 && t + H01 < b)
    {
      fragments.push(
        {
          type: 'H01',
          date: `${YYYY}${_MM}${_DD}-${_HH}`,
          // startAt: t,
          // endAt: t + H01 -1
        }
      );

      // console.log(txt, 'H01');
      t += H01;
    }
    else
    {
      fragments.push(
        {
          type: 'M15',
          date: `${YYYY}${_MM}${_DD}-${_HH}${_mm}`,
          // startAt: t,
          // endAt: t + M15 -1
        }
      );

      // console.log(txt, 'M15');
      t += M15;
    }
  }

  return fragments;
}

export default { extract };