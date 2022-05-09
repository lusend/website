function replaceHTML({
  sourceSelector = false,
  destSelector = false,
  appendDest = false,
  defaultSource = false,
  prefix = '',
  suffix = '',
  toData = false,
  toString = function (source) {
    return source;
  },
  passChecks = function (source, dest) {
    return source && dest.length;
  }
}) {
  try {
    if (!sourceSelector && !destSelector) return undefined;
    const source =
      typeof sourceSelector === 'string'
        ? $(sourceSelector)
        : $('<p>' + sourceSelector() + '</p>');

    if (!source.length && !defaultSource) return undefined;

    const sourceValue = source.length
      ? source
          .contents()
          .filter(function () {
            return this.nodeType == 3;
          })[0]
          .nodeValue.trim()
      : defaultSource;

    if (!Array.isArray(destSelector)) destSelector = [destSelector];
    const dest = destSelector.map((selector) => $(selector));

    if (!passChecks(sourceValue || defaultSource, dest)) return undefined;

    const finalValue = sourceValue || defaultSource;

    dest.forEach((element) =>
      element.html(
        (appendDest ? element.html() : '') +
          prefix +
          toString(finalValue) +
          suffix
      )
    );

    return toData ? toData(finalValue) : toString(finalValue);
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}

function validDate(str) {
  return !!Date.parse(str);
}

function cleanDate(str) {
  return new Date(str.replace(/\*/g, '').trim());
}

function formatDate(date, long = true) {
  if (Date.parse(date))
    return new Date(date).toLocaleDateString(
      'en-us',
      long
        ? {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        : {}
    );

  return date;
}

function dateBeforeToday(date) {
  if (!Date.parse(date)) return false;
  return Date.parse(date) < new Date().setHours(0, 0, 0, 0);
}

function gup(paramName) {
  return window.location.search
    .substring(1)
    .split('&')
    .reduce((prev, param) => {
      const pair = param.split('=');
      if (pair.length <= 1) return prev;
      if (pair[0] === paramName) return decodeURIComponent(pair[1]);
    }, null);
}

function getDefaultBackground(title) {
  const baseLink =
    'https://liberty-sa.terradotta.com/_customtags/ct_Image.cfm?Image_ID=';

  if (window.backgrounds) {
    for (let bg in window.backgrounds) {
      const keyword = window.backgrounds[bg].keyword.toLowerCase();
      const id = window.backgrounds[bg].id;
      if (title.toLowerCase().includes(keyword)) {
        return Alpine.store('background', baseLink + id);
      }
    }
  }

  Alpine.store('background', baseLink + '21698');
}

document.addEventListener('alpine:init', () => {
  Alpine.store('program', {
    title: undefined,
    startDate: undefined,
    endDate: undefined,
    appDeadline: undefined,
    id: undefined,
    canApply: true,

    init() {
      this.id = gup('Program_ID');

      const dateRow =
        $(
          '#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr td[headers^=h_1]'
        ).length + 1;

      // START DATE
      this.startDate = replaceHTML({
        sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(5) > span`,
        destSelector: '#appSubtitle',
        defaultSource: 'Program Dates TBA',
        toString: (source) => formatDate(source.replace(/\*/g, '').trim()),
        toData: (source) => new Date(source),
        passChecks: (source, dest) =>
          source &&
          (validDate(source) || source === 'Program Dates TBA') &&
          dest.length
      });

      // END DATE
      this.endDate = replaceHTML({
        sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(6) > span`,
        destSelector: '#appSubtitle',
        appendDest: true,
        prefix: ' – ',
        toString: (source) => formatDate(source.replace(/\*/g, '').trim()),
        toData: (source) => new Date(source),
        passChecks: (source, dest) => source && validDate(source) && dest.length
      });

      // APP DEADLINE
      this.appDeadline = replaceHTML({
        sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(3) > span`,
        destSelector: '#appApplicationDeadline',
        prefix: 'Applications Due By ',
        toString: (source) =>
          formatDate(source.replace(/\*/g, '').trim(), false),
        toData: (source) => new Date(source),
        passChecks: (source, dest) => source && validDate(source) && dest.length
      });

      // TITLE
      this.title = replaceHTML({
        sourceSelector:
          '#pagebodycontent > div.page-header > div > h3.col-sm-10',
        destSelector: ['#appTitle', '#appCurrentBreadcrumb'],
        defaultSource: 'Program Brochure',
        toString: (source) =>
          source
            .replace(/LU Send - /g, '')
            .replace(/LU Send Domestic - /g, '')
            .replace(/LUS - /g, '')
            .trim()
      });

      // REQUEST INFO
      if ($('#appRequestInfo').length && gup('Program_ID'))
        $('#appRequestInfo').attr(
          'href',
          $('#appRequestInfo').attr('href') + gup('Program_ID')
        );

      // APPLY NOW
      if ($('#appApplyNow').length && gup('Program_ID'))
        $('#appApplyNow').attr(
          'href',
          $('#appApplyNow').attr('href') + gup('Program_ID')
        );

      // PAST APP DEADLINE
      if (
        $('#appApplicationDeadline').length &&
        this.appDeadline !== undefined &&
        dateBeforeToday(this.appDeadline)
      ) {
        this.canApply = 'The application deadline has already passed!';
      }

      // APPLY NOW DISABLED
      if (!$("button[onclick='ApplyNow();']").length)
        this.canApply = 'New applications are currently disabled!';

      // EDIT BROCHURE
      if ($('#appEdit').length && gup('Program_ID'))
        $('#appEdit').attr(
          'href',
          $('#appEdit').attr('href') + gup('Program_ID')
        );
    }
  });
});
