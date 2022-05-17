function replaceHTML({
  sourceSelector = false,
  destSelector = false,
  appendDest = false,
  defaultSource = false,
  prefix = '',
  suffix = '',
  mangleData = false,
  mangleString = function (source) {
    return source;
  },
  passChecks = function (source) {
    return source;
  }
}) {
  try {
    if (!sourceSelector) return undefined;

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
          })
          .text()
          .trim()
      : defaultSource;

    if (!passChecks(sourceValue || defaultSource)) return undefined;

    const finalValue = sourceValue || defaultSource;

    if (destSelector) {
      if (!Array.isArray(destSelector)) destSelector = [destSelector];
      const dest = destSelector.map((selector) => $(selector));

      dest.forEach((element) =>
        element.html(
          (appendDest ? element.html() : '') +
            prefix +
            mangleString(finalValue) +
            suffix
        )
      );
    }

    return mangleData ? mangleData(finalValue) : mangleString(finalValue);
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

function getBackgroundID(searchText) {
  for (let bg in window.backgrounds) {
    const keyword = window.backgrounds[bg].keyword.toLowerCase();
    const id = window.backgrounds[bg].id;
    if (searchText.toLowerCase().includes(keyword)) {
      return id;
    }
  }

  return undefined;
}

function getDefaultBackground(title, schools, departments, locations) {
  const baseLink =
    'https://liberty-sa.terradotta.com/_customtags/ct_Image.cfm?Image_ID=';

  let backgroundID = undefined;

  if (window.backgrounds) {
    // Based on Title
    backgroundID = getBackgroundID(title);

    if (backgroundID !== undefined) return baseLink + backgroundID;

    // Based on School
    const schoolBackupTitle = schools.join(', ');

    backgroundID = getBackgroundID(schoolBackupTitle);

    if (backgroundID !== undefined) return baseLink + backgroundID;

    // Based on Department
    const departmentBackupTitle = departments.join(', ');

    backgroundID = getBackgroundID(departmentBackupTitle);

    if (backgroundID !== undefined) return baseLink + backgroundID;

    // Based on Location
    const locationBackupTitle = locations
      .map((loc) => loc.city + ', ' + loc.country)
      .join(' | ');

    backgroundID = getBackgroundID(locationBackupTitle);

    if (backgroundID !== undefined) return baseLink + backgroundID;
  }

  return baseLink + '21698';
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

document.addEventListener('alpine:init', () => {
  Alpine.store('background', '');
  Alpine.store('program', {
    title: undefined,
    startDate: undefined,
    endDate: undefined,
    appDeadline: undefined,
    id: undefined,
    term: undefined,
    schools: [],
    departments: [],
    courses: {
      all: [],
      cser: undefined,
      academicEnrichment: undefined
    },
    locations: [],
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
        mangleString: (source) => formatDate(source.replace(/\*/g, '').trim()),
        mangleData: (source) => new Date(source),
        passChecks: (source) =>
          source && (validDate(source) || source === 'Program Dates TBA')
      });

      // END DATE
      this.endDate = replaceHTML({
        sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(6) > span`,
        destSelector: '#appSubtitle',
        appendDest: true,
        prefix: ' – ',
        mangleString: (source) => formatDate(source.replace(/\*/g, '').trim()),
        mangleData: (source) => new Date(source),
        passChecks: (source) => source && validDate(source)
      });

      // APP DEADLINE
      this.appDeadline = replaceHTML({
        sourceSelector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${dateRow}) > td:nth-child(3) > span`,
        destSelector: '#appApplicationDeadline',
        prefix: 'Applications Due By ',
        mangleString: (source) =>
          formatDate(source.replace(/\*/g, '').trim(), false),
        mangleData: (source) => new Date(source),
        passChecks: (source) => source && validDate(source)
      });

      // TITLE
      this.title = replaceHTML({
        sourceSelector:
          '#pagebodycontent > div.page-header > div > h3.col-sm-10',
        destSelector: ['#appTitle', '#appCurrentBreadcrumb'],
        defaultSource: 'Program Brochure',
        mangleString: (source) =>
          source
            .replace(/LU Send - /g, '')
            .replace(/LU Send Domestic - /g, '')
            .replace(/LUS - /g, '')
            .trim()
      });

      // TERM
      this.term =
        replaceHTML({
          sourceSelector: '[id^=id_11029]'
        }) || '';

      // SCHOOLS
      this.schools =
        replaceHTML({
          sourceSelector: '[id^=id_11034]',
          mangleData: (source) => source.split(', ')
        }) || [];

      // DEPARTMENTS
      this.departments =
        replaceHTML({
          sourceSelector: '[id^=id_11035]',
          mangleData: (source) => source.split(', ')
        }) || [];

      // LOCATIONS
      this.locations =
        replaceHTML({
          sourceSelector:
            '#pagebodycontent div.row div.col-sm-8.col-lg-9 ul li:nth-child(1) span',
          mangleString: (source) => source.split(';').join(' | '),
          mangleData: (source) =>
            source.split(';').map((item) => ({
              city: item.split(', ')[0],
              country: item.split(', ')[1]
            }))
        }) || [];

      // COURSES
      this.courses.all =
        replaceHTML({
          sourceSelector: '[id^=id_11010]',
          mangleData: (source) =>
            source.split(', ').filter((item) => {
              if (item.toLowerCase() === 'cser') {
                this.courses.cser = true;
                return false;
              }

              if (item.toLowerCase() === 'not for credit') {
                this.courses.academicEnrichment = true;
                return false;
              }

              return true;
            })
        }) || [];

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
