function toFixed(value, digit = 2) {
  if (!value) {
    return 0;
  }

  console.log(value);

  var with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

  return with2Decimals;
}

export default {
  toFixed,
};
