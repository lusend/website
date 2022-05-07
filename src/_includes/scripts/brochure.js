function replaceHTML({
  sourceSelector = false,
  destSelector = false,
  appendDest = false,
  defaultSource = false,
  passChecks = function (source, dest) {
    return source && dest.length;
  },
  modifyContent = function (source) {
    return source;
  }
}) {
  try {
    if (!sourceSelector && !destSelector) return false;
    const source =
      typeof sourceSelector === 'string'
        ? $(sourceSelector)
        : $('<p>' + sourceSelector() + '</p>');

    if (!source.length && !defaultSource) return false;

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

    if (!passChecks(sourceValue || defaultSource, dest)) return false;

    dest.forEach((element) =>
      element.html(
        (appendDest ? element.html() : '') +
          modifyContent(sourceValue || defaultSource)
      )
    );

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

function validDate(str) {
  return !!Date.parse(str);
}

function formatDate(str, long = true) {
  if (Date.parse(str))
    return new Date(str).toLocaleDateString(
      'en-us',
      long
        ? {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        : {}
    );

  return str;
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

window.addEventListener('load', function () {
  const dateRow =
    $(
      '#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr td[headers^=h_1]'
    ).length + 1;

  // START DATE
  replaceHTML({
    sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(5) > span`,
    destSelector: '#appSubtitle',
    defaultSource: 'Program Dates TBA',
    modifyContent: (source) => formatDate(source.replace(/\*/g, '').trim()),
    passChecks: (source, dest) =>
      source &&
      (validDate(source) || source === 'Program Dates TBA') &&
      dest.length
  });

  // END DATE
  replaceHTML({
    sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(6) > span`,
    destSelector: '#appSubtitle',
    appendDest: true,
    modifyContent: (source) =>
      ' – ' + formatDate(source.replace(/\*/g, '').trim()),
    passChecks: (source, dest) => source && validDate(source) && dest.length
  });

  // APP DEADLINE
  replaceHTML({
    sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(3) > span`,
    destSelector: '#appApplicationDeadline',
    modifyContent: (source) =>
      'Applications Due By ' +
      formatDate(source.replace(/\*/g, '').trim(), false) +
      '',
    passChecks: (source, dest) => source && validDate(source) && dest.length
  });

  // TITLE
  replaceHTML({
    sourceSelector: '#pagebodycontent > div.page-header > div > h3.col-sm-10',
    destSelector: ['#appTitle', '#appCurrentBreadcrumb'],
    defaultSource: 'Program Brochure',
    modifyContent: (source) =>
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

  // EDIT LINK
  if ($('#appEdit').length && gup('Program_ID'))
    $('#appEdit').attr('href', $('#appEdit').attr('href') + gup('Program_ID'));
});
