function getSelectorContents({
  selector = '',
  defaultValue = undefined,
  prefix = '',
  suffix = '',
  verifyContent = function (str) {
    return !!str;
  },
  formatString = function (str) {
    return str;
  },
  formatData = function (str) {
    return str;
  }
}) {
  const source =
    typeof selector === 'string' ? $(selector) : $('<p>' + selector() + '</p>');

  const results = {
    data: undefined,
    string: undefined,
    value: undefined
  };

  if (!source.length && defaultValue === undefined) return results;

  const sourceValue = source.length
    ? source
        .contents()
        .filter(function () {
          return this.nodeType == 3;
        })
        .text()
        .trim()
    : defaultValue;

  if (!verifyContent(sourceValue)) {
    const formattedString = formatString(defaultValue);
    results.value = formattedString;
    results.string = formattedString;
    results.data = formatData(formattedString);
    return results;
  }

  const formattedString = formatString(sourceValue);
  results.value = prefix + formattedString + suffix;
  results.string = formattedString;
  results.data = formatData(formattedString);
  return results;
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
    }, undefined);
}

function getBackground(searchText) {
  for (let bg in window.backgrounds) {
    const keyword = window.backgrounds[bg].keyword.toLowerCase();
    const id = window.backgrounds[bg].id;
    if (searchText.toLowerCase().includes(keyword)) {
      return window.backgrounds[bg];
    }
  }

  return { id: undefined, keyword: undefined, position: '50%' };
}

function getDefaultBackground(items = ['']) {
  const baseLink =
    'https://liberty-sa.terradotta.com/_customtags/ct_Image.cfm?Image_ID=';

  if (window.backgrounds) {
    for (let item of items) {
      const background = getBackground(item);
      if (background.id !== undefined)
        return {
          image: baseLink + background.id,
          position: background.position || '50%'
        };
    }
  }

  return {
    image: baseLink + '21698',
    position: '50%'
  };
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

document.addEventListener('alpine:init', () => {
  Alpine.store('program', {
    id: undefined,
    dateRow: undefined,

    startDate: undefined,
    endDate: undefined,
    appDeadline: undefined,
    title: undefined,
    term: undefined,
    schools: undefined,
    departments: undefined,
    countries: undefined,
    cities: undefined,
    courses: undefined,
    cser: undefined,
    notForCredit: undefined,
    disableApply: undefined,

    getDefaultStartDate() {
      return getSelectorContents({
        selector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${this.dateRow}) > td:nth-child(5) > span`,
        defaultValue: 'Program Dates Unknown',
        formatData: function (str) {
          return new Date(str);
        },
        formatString: function (str) {
          return formatDate(str.replace(/\*/g, '').trim());
        },
        verifyContent: function (str) {
          return str && validDate(str);
        }
      });
    },

    getStartDate() {
      return this.startDate || this.getDefaultStartDate().value || '';
    },

    getDefaultEndDate() {
      return getSelectorContents({
        selector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${this.dateRow}) > td:nth-child(6) > span`,
        defaultValue: '',
        formatData: function (str) {
          return new Date(str);
        },
        formatString: function (str) {
          return formatDate(str.replace(/\*/g, '').trim());
        },
        verifyContent: function (str) {
          return str && validDate(str);
        }
      });
    },

    getEndDate() {
      return this.endDate || this.getDefaultEndDate().value || '';
    },

    getDate() {
      if (this.getEndDate())
        return this.getStartDate() + ' - ' + this.getEndDate();
      return this.getStartDate();
    },

    getDefaultAppDeadline() {
      return getSelectorContents({
        selector: `#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr:nth-child(${this.dateRow}) > td:nth-child(3) > span`,
        prefix: 'Applications Due By ',
        defaultValue: 'Unknown Application Deadline',
        formatData: function (str) {
          return new Date(str);
        },
        formatString: function (str) {
          return formatDate(str.replace(/\*/g, '').trim(), false);
        },
        verifyContent: function (str) {
          return str && validDate(str.replace(/\*/g, '').trim());
        }
      });
    },

    getAppDeadline() {
      return this.appDeadline || this.getDefaultAppDeadline().value || '';
    },

    getDefaultTitle() {
      return getSelectorContents({
        selector: '#pagebodycontent > div.page-header > div > h3.col-sm-10',
        defaultValue: 'Program Brochure',
        formatString: function (str) {
          return str
            .replace(/LU Send - /g, '')
            .replace(/LU Send Domestic - /g, '')
            .replace(/LUS - /g, '')
            .trim();
        }
      });
    },

    getTitle() {
      return this.title || this.getDefaultTitle().value || '';
    },

    getDefaultTerm() {
      return getSelectorContents({
        selector: '[id^=id_11029]',
        defaultValue: 'N/A'
      });
    },

    getTerm() {
      return this.term || this.getDefaultTerm().value || '';
    },

    getDefaultSchools() {
      return getSelectorContents({
        selector: '[id^=id_11034]',
        defaultValue: 'N/A',
        formatData: function (str) {
          return str.split(', ');
        }
      });
    },

    getSchools() {
      return this.schools || this.getDefaultSchools().value || '';
    },

    getDefaultDepartments() {
      return getSelectorContents({
        selector: '[id^=id_11035]',
        defaultValue: 'N/A',
        formatData: function (str) {
          return str.split(', ');
        }
      });
    },

    getDepartments() {
      return this.departments || this.getDefaultDepartments().value || '';
    },

    getDefaultCountries() {
      return getSelectorContents({
        selector:
          '#pagebodycontent div.row div.col-sm-8.col-lg-9 ul li:nth-child(1) span',
        defaultValue: 'N/A',
        formatString: function (str) {
          return str
            .split(';')
            .map(function (item) {
              const items = item.split(', ');
              return items.length > 1 ? items[items.length - 1] : items[0];
            })
            .filter(onlyUnique)
            .filter((item) => !!item)
            .join(', ');
        },
        formatData: function (str) {
          return str.split(', ');
        }
      });
    },

    getCountries() {
      return this.countries || this.getDefaultCountries().value || '';
    },

    getDefaultCities() {
      return getSelectorContents({
        selector:
          '#pagebodycontent div.row div.col-sm-8.col-lg-9 ul li:nth-child(1) span',
        defaultValue: 'N/A',
        formatString: function (str) {
          return str
            .split(';')
            .map(function (item) {
              const newItems = item.split(', ');
              newItems.pop();
              return newItems.join(' ');
            })
            .filter(onlyUnique)
            .filter((item) => !!item)
            .join(', ');
        },
        formatData: function (str) {
          return str.split(', ');
        }
      });
    },

    getCities() {
      return this.cities || this.getDefaultCities().value || '';
    },

    getDefaultCourses() {
      return getSelectorContents({
        selector: '[id^=id_11010]',
        defaultValue: 'N/A',
        formatString: function (str) {
          return str
            .split(', ')
            .filter(function (item) {
              return (
                item.toLowerCase() !== 'cser' &&
                item.toLowerCase() !== 'not for credit'
              );
            })
            .join(', ');
        },
        formatData: function (str) {
          return str.split(', ');
        }
      });
    },

    getCourses() {
      return this.courses || this.getDefaultCourses().value || '';
    },

    getDefaultCSER() {
      return getSelectorContents({
        selector: '[id^=id_11010]',
        defaultValue: '👎',
        formatString: function (str) {
          return str.toLowerCase().includes('cser') ? '👍 Yes' : '👎 No';
        },
        formatData: function (str) {
          return str.includes('👎') ? false : true;
        }
      });
    },

    getCSER() {
      return this.cser || this.getDefaultCSER().value || '';
    },

    getDefaultNotForCredit() {
      return getSelectorContents({
        selector: '[id^=id_11010]',
        defaultValue: '👎',
        formatString: function (str) {
          return str.toLowerCase().includes('not for credit')
            ? '👍 Yes'
            : '👎 No';
        },
        formatData: function (str) {
          return str.includes('👎') ? false : true;
        }
      });
    },

    getNotForCredit() {
      return this.notForCredit || this.getDefaultNotForCredit().value || '';
    },

    getDefaultDisableApply(disable) {
      if (
        this.getDefaultAppDeadline().data &&
        dateBeforeToday(this.getDefaultAppDeadline().data)
      )
        return 'The application deadline has already passed!';

      if (!$("button[onclick='ApplyNow();']").length)
        return 'An application is not yet available for this program!';

      if (disable)
        return 'This program is currently not accepting applications.';

      return '';
    },

    getDisableApply() {
      return this.disableApply === undefined
        ? this.getDefaultDisableApply(true)
        : this.disableApply;
    },

    init() {
      this.id =
        gup('Program_ID') === 'undefined' ? undefined : gup('Program_ID');

      this.dateRow =
        $(
          '#pagebody > div.panel.panel-primary > div.table-responsive > table > tbody > tr td[headers^=h_1]'
        ).length + 1;
    }
  });
});
