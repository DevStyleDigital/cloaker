const MAP = [
  { suffix: 'tri', threshold: 1e12 },
  { suffix: 'bi', threshold: 1e9 },
  { suffix: 'mi', threshold: 1e6 },
  { suffix: 'mil', threshold: 1e3 },
  { suffix: '', threshold: 1 },
];

export function formatNumber(num: number, precision = 1) {
  if (num === Infinity) return num < 0 ? '-999tri' : '+999tri';
  const toReplace = precision
    ? `.${Array.from({ length: precision }, () => '0').join('')}`
    : '';

  const found = MAP.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (Math.abs(num) / found.threshold).toFixed(precision) + found.suffix;
    return num < 0
      ? `-${formatted}`.replace(toReplace, '')
      : `+${formatted}`.replace(toReplace, '');
  }

  if (num < 1)
    return num < 0 ? `-${num.toFixed(precision)}` : `+${num.toFixed(precision)}`;

  return num < 0 ? `-${num}`.replace(toReplace, '') : `+${num}`.replace(toReplace, '');
}
