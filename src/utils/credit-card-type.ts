const testers = {
  visa: new RegExp('^4'),
  // Updated for Mastercard 2017 BINs expansion
  mastercard: new RegExp(
    '^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$',
  ),
  amex: new RegExp('^3[47]'),
  discover: new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)',
  ),
  diners: new RegExp('^3(0[0-5]|[68])'),
  jcb: new RegExp('^35(2[89]|[3-8][0-9])'),
  union: new RegExp('^(62[0-9]{14,17})'),
};

export function creditCardType(cc: string) {
  const type = Object.entries(testers).filter(([_, r]) => cc.match(r))[0]?.[0];
  return type || undefined;
}

export function formatBrand(brand: string) {
  const brands = Object.keys(testers);
  return brands.find((brandFormatted) => brand.includes(brandFormatted));
}
