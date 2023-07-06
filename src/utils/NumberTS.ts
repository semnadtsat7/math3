export function truncate (value: number, decimal: number = 1)
{
  const d = Math.pow(10, decimal); // d = 10^1
  const v = Math.round(value * d) / d; // v = (value * 1) / 1

  return v;
}

export function prettify (value: number = 0) // function change value to string
{
  return value.toLocaleString('en', {maximumSignificantDigits : 21}); // return value to string
}

export function prettifyF (value: number, d: number = 1)
{
  return prettify(truncate(value, d));  // return the right now Date/Time with truncation, already
}

export function percentage (a: number | null | undefined, b: number | null | undefined)
{
  const aa = a || 0;
  const bb = b || 0;

  const cc = (aa / bb) || 0;

  return truncate(cc * 100, 2);
}

export default
{
  truncate,
  percentage,

  prettify,
  prettifyF
}