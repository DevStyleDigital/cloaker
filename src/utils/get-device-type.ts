export function getDeviceType(ua: string) {
  let device = '';

  if (
    /(GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML)/i.test(
      ua,
    )
  ) {
    device = 'other';
  } else if (/(Xbox|PLAYSTATION.3|Wii)/i.test(ua)) {
    device = 'other';
  } else if (
    (/(iP(a|ro)d)|tablet/i.test(ua) && !/RX-34/i.test(ua)) ||
    /FOLIO/i.test(ua)
  ) {
    device = 'tablet';
  } else if (
    /Linux/i.test(ua) &&
    /Android/i.test(ua) &&
    !/(Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945)/i.test(ua)
  ) {
    device = 'tablet';
  } else if (/Kindle/i.test(ua) || (/Mac.OS/i.test(ua) && /Silk/i.test(ua))) {
    device = 'tablet';
  } else if (
    /(GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook|MB511)/i.test(
      ua,
    ) &&
    /RUTEM/i.test(ua)
  ) {
    device = 'tablet';
  } else if (
    /BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i.test(
      ua,
    )
  ) {
    device = 'phone';
  } else if (
    /Opera/i.test(ua) &&
    /Windows.NT.5/i.test(ua) &&
    /(HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9)/i.test(ua)
  ) {
    device = 'phone';
  } else if (
    (/Windows.(NT|XP|ME|9)/i.test(ua) && !/Phone/i.test(ua)) ||
    /Win(9|.9|NT)/i.test(ua)
  ) {
    device = 'computer';
  } else if (/Macintosh|PowerPC/i.test(ua) && !/Silk/i.test(ua)) {
    device = 'computer';
  } else if (/Linux/i.test(ua) && /X11/i.test(ua)) {
    device = 'computer';
  } else if (/Solaris|SunOS|BSD/i.test(ua)) {
    device = 'computer';
  } else if (
    /Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i.test(
      ua,
    ) &&
    !/Mobile/i.test(ua)
  ) {
    device = 'computer';
  } else {
    device = 'other';
  }

  return device;
}
