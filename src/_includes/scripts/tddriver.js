var __async = (__this, __arguments, generator) =>
  new Promise((resolve, reject) => {
    var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      },
      rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      },
      step = (x) =>
        x.done
          ? resolve(x.value)
          : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });

class TDDriver {
  constructor(customID = 'custom', customName = 'Common Searches') {
    (this.customID = 'custom'),
      (this.customName = 'Common Searches'),
      (this.baseURL = 'https://liberty-sa.terradotta.com/'),
      (this.baseAPIURL = 'https://liberty-sa.terradotta.com/piapi/index.cfm?'),
      (this.basePossibleElements = [
        {
          elementURL: 'program_name',
          elementID: 'program_name',
          searchURL: 'ProgramName',
          searchID: 'PROGRAM_NAME',
          terminator: !1
        },
        {
          elementURL: 'city',
          elementID: 'pi',
          searchURL: 'City',
          searchID: 'PROGRAM_CITY',
          terminator: !0
        },
        {
          elementURL: 'country',
          elementID: 'pc',
          searchURL: 'Country',
          searchID: 'PROGRAM_COUNTRY',
          terminator: !0
        },
        {
          elementURL: 'region',
          elementID: 'pr',
          searchURL: 'Region',
          searchID: 'PROGRAM_REGION',
          terminator: !0
        },
        {
          elementURL: 'terms',
          elementID: 'pt',
          searchURL: 'Term',
          terminator: !0
        },
        {
          elementURL: 'program_type',
          elementID: 'program_type_id',
          searchURL: 'ProgramType',
          terminator: !1
        }
      ]),
      (this.registeredElements = []),
      (this.registeredResults = []),
      (this.curSearchElementURL = ''),
      (this.curSearchResultsURL = ''),
      (this.curSearchResultsVerbiage = ''),
      (this.searchElements = []),
      (this.searchResults = []),
      (this.customID = customID),
      (this.customName = customName);
  }
  cleanseString(value) {
    return encodeURIComponent(value).replace(/"/g, '%22').replace(/'/g, '%27');
  }
  cleanseValue(value) {
    return Array.isArray(value)
      ? value.map(this.cleanseString)
      : this.cleanseString(value);
  }
  splitArray(array, filter) {
    return array.reduce(
      ([pass, fail], elem) =>
        filter(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
      [[], []]
    );
  }
  duplicateArray(array) {
    return array.reduce((res, current) => res.concat([current, current]), []);
  }
  convertToArray(value) {
    return Object.keys(value).length
      ? Object.values(
          (null == value ? void 0 : value.hasOwnProperty('1'))
            ? value
            : {
                1: value
              }
        )
      : Array.isArray(value)
      ? value
      : [value];
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  currentIDForm(id) {
    return this.basePossibleElements.reduce(
      (val, el) => (
        Object.keys(el).forEach((key) => {
          el[key] === id && (val = key);
        }),
        val
      ),
      ''
    );
  }
  convertID(id, phase) {
    var phase1Index = this.basePossibleElements.findIndex(
        (val) => val.elementURL.toLowerCase() === id.toLowerCase()
      ),
      phase2Index = this.basePossibleElements.findIndex(
        (val) => val.elementID.toLowerCase() === id.toLowerCase()
      ),
      phase3Index = this.basePossibleElements.findIndex(
        (val) => val.searchURL.toLowerCase() === id.toLowerCase()
      ),
      phase4Index = this.basePossibleElements.findIndex((val) => {
        var _a;
        return (
          (null == (_a = val.searchID) ? void 0 : _a.toLowerCase()) ===
          id.toLowerCase()
        );
      });
    return phase1Index >= 0
      ? this.basePossibleElements[phase1Index][phase] || ''
      : phase2Index >= 0
      ? this.basePossibleElements[phase2Index][phase] || ''
      : phase3Index >= 0
      ? this.basePossibleElements[phase3Index][phase] || ''
      : phase4Index >= 0
      ? this.basePossibleElements[phase4Index][phase] || ''
      : 'elementURL' === phase && id.startsWith('p_') && !isNaN(+id.substr(2))
      ? id.substr(2)
      : 'elementURL' === phase || id.startsWith('p_') || isNaN(+id)
      ? id
      : `p_${id}`;
  }
  createParam(
    key,
    value,
    {
      prefix: prefix = '',
      suffix: suffix = '',
      delimeter: delimeter = '%2C',
      terminator: terminator = !1
    } = {}
  ) {
    return (
      (terminator =
        !0 === terminator ? '%7F' : !1 === terminator ? '' : terminator),
      (value = this.cleanseValue(value)),
      `${prefix}${key}=${(value = Array.isArray(value)
        ? value.join(terminator + delimeter)
        : value)}${terminator}${suffix}`
    );
  }
  generateInitialURL(type) {
    return (
      this.baseAPIURL +
      [
        this.createParam('callName', type),
        this.createParam('ResponseEncoding', 'JSON'),
        this.createParam('callback', 'false')
      ].join('&')
    );
  }
  generateElementURL() {
    var [base, params] = this.splitArray(
      this.registeredElements,
      (val) => !!this.currentIDForm(val.id)
    );
    return [
      this.generateInitialURL('getProgramSearchElements'),
      ...base.map((val) =>
        this.createParam(this.convertID(val.id, 'elementURL'), 'true')
      ),
      params.length && this.createParam('parameters', 'true'),
      params.length &&
        this.createParam(
          'param_ids',
          params.map((i) => i.id)
        )
    ]
      .filter((i) => !!i)
      .join('&');
  }
  generateProgramDataURL(id) {
    return [
      this.generateInitialURL('getProgramBrochure'),
      this.createParam('Program_ID', id),
      this.createParam('Options', 'locations,terms,parameters,dates')
    ]
      .filter((i) => !!i)
      .join('&');
  }
  generateResultsParams(params) {
    return (
      (params.length ? this.createParam('Params', '') : '') +
      this.duplicateArray(
        params.map((p) => ((p.id = this.convertID(p.id, 'searchURL')), p))
      )
        .map((param, index) => {
          var _a;
          return index % 2 == 1
            ? this.createParam(
                `${param.id}_t`,
                (null ==
                (_a = this.searchElements.find((el) => el.id === param.id))
                  ? void 0
                  : _a.type) || ''
              )
            : this.createParam(param.id, param.value, {
                terminator: !0
              });
        })
        .join('|')
    );
  }
  generateResultsURL(permanentOnly = !1) {
    var [base, params] = this.splitArray(
      this.registeredResults.filter((res) => !permanentOnly || !!res.permanent),
      (val) => !!this.currentIDForm(val.id)
    );
    return [
      this.generateInitialURL('getProgramSearchResults'),
      ...base.map((val) => {
        var _a;
        return this.createParam(
          this.convertID(val.id, 'searchURL'),
          val.value,
          {
            terminator: !!(null ==
            (_a = this.basePossibleElements.find(
              (el) => el.searchURL === this.convertID(val.id, 'searchURL')
            ))
              ? void 0
              : _a.terminator)
          }
        );
      }),
      this.generateResultsParams(params)
    ]
      .filter((i) => !!i)
      .join('&');
  }
  checkSearchElementValid(id) {
    var flag = !0;
    return (
      isNaN(+id) &&
        !this.currentIDForm(id) &&
        (console.warn(`This search element '${id}' does not exist.`),
        (flag = !1)),
      flag
    );
  }
  checkSearchValueValid(id) {
    var flag = !0;
    return (
      this.curSearchElementURL ||
        (console.warn(
          `Make sure to register search elements and pull them first (triggered by '${id}').`
        ),
        (flag = !1)),
      ((!id.startsWith('p_') && isNaN(+id)) ||
        (id.startsWith('p_') && isNaN(+id.substr(2)))) &&
        !this.currentIDForm(id) &&
        id !== this.customID &&
        (console.warn(`This search element '${id}' does not exist.`),
        (flag = !1)),
      this.searchElements.some(
        (el) => el.id === this.convertID(id, 'searchURL')
      ) ||
        (console.warn(`This search element '${id}' has not been registered.`),
        (flag = !1)),
      flag
    );
  }
  checkProgramValid(id) {
    var flag = !0;
    return (
      this.searchResults.some((i) => i.id === id) ||
        (console.warn(
          `This program id '${id}' does not exist in the current search results.`
        ),
        (flag = !1)),
      flag
    );
  }
  readyToSearch() {
    return !!this.curSearchElementURL;
  }
  readyForResults() {
    return !!this.curSearchResultsURL;
  }
  saveSearchElements(data) {
    this.searchElements = Object.entries(data.ELEMENT)
      .map(([, element]) => {
        var _a;
        var prevElement = this.registeredElements.find(
          (el) =>
            this.convertID(el.id, 'elementURL') ===
            this.convertID(element.FORM_NAME, 'elementURL')
        );
        return {
          id: this.convertID(element.FORM_NAME, 'searchURL'),
          name: element.DISPLAY_NAME,
          type: null == element ? void 0 : element.PARAM_TYPE,
          values:
            Object.entries(
              (null == (_a = null == element ? void 0 : element.OPTIONS)
                ? void 0
                : _a.OPTION) || {}
            )
              .map(([, i]) => ({
                value: i.VALUE,
                name: i.NAME
              }))
              .filter((i) => !!i.value) || void 0,
          private: !!(null == prevElement ? void 0 : prevElement.private)
        };
      })
      .sort(
        (a, b) =>
          this.registeredElements.findIndex(
            (el) => this.convertID(el.id, 'searchURL') === a.id
          ) -
          this.registeredElements.findIndex(
            (el) => this.convertID(el.id, 'searchURL') === b.id
          )
      );
  }
  saveSearchResults(data) {
    this.curSearchResultsVerbiage = data.SEARCHVERBIAGE.replace(
      /^(.*), sorted by.*$/g,
      '$1'
    );
    var programs = this.convertToArray(data.PROGRAM || []);
    this.searchResults = Object.entries(programs).reduce((res, [, curProg]) => {
      var _a;
      return (
        res.every((p) => p.id !== curProg.PROGRAM_ID) &&
          res.push({
            id: curProg.PROGRAM_ID,
            name: curProg.PROGRAM_NAME,
            locations: []
          }),
        null == (_a = res.find((p) => p.id === curProg.PROGRAM_ID)) ||
          _a.locations.push({
            city: curProg.PROGRAM_CITY,
            country: curProg.PROGRAM_COUNTRY,
            region: curProg.PROGRAM_REGION,
            longitude: curProg.PROGRAM_LONGITUDE || 0,
            latitude: curProg.PROGRAM_LATITUDE || 0
          }),
        res
      );
    }, []);
  }
  saveProgramData(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    data = data.DETAILS;
    var res = {};
    (res.id = data.PROGRAM_ID),
      (res.name = data.PROGRAM_NAME),
      (res.createdDate = data.PROGRAM_CREATED),
      (res.modifiedDate = data.PROGRAM_MODIFIED),
      (res.brochureText = data.PROGRAM_BROCHURE),
      (res.active = !!data.PROGRAM_ACTIVE),
      (res.terms = this.convertToArray(data.TERMS.TERM).map(
        (term) => term.PROGRAM_TERM
      )),
      (res.parameters = this.convertToArray(data.PARAMETERS.PARAMETER).reduce(
        (params, param) => {
          var index2 = params.findIndex((p) => p.id === param.PARAM_ID);
          return (
            (params.length && -1 !== index2) ||
              params.push({
                id: param.PARAM_ID,
                name: param.PROGRAM_PARAM_TEXT,
                type: param.PARAM_TYPE,
                value: []
              }),
            params[-1 === index2 ? params.length - 1 : index2].value.push(
              param.PARAM_VALUE
            ),
            params
          );
        },
        []
      )),
      (res.infoLink = (
        null ==
        (_b =
          null == (_a = null == data ? void 0 : data.INFO_REQUEST)
            ? void 0
            : _a.LINK)
          ? void 0
          : _b.HREF
      )
        ? this.baseURL +
          (null ==
          (_d =
            null == (_c = null == data ? void 0 : data.INFO_REQUEST)
              ? void 0
              : _c.LINK)
            ? void 0
            : _d.HREF)
        : ''),
      (res.applyLink = (
        null ==
        (_f =
          null == (_e = null == data ? void 0 : data.APPLY_NOW)
            ? void 0
            : _e.LINK)
          ? void 0
          : _f.HREF
      )
        ? this.baseURL +
          (null ==
          (_h =
            null == (_g = null == data ? void 0 : data.APPLY_NOW)
              ? void 0
              : _g.LINK)
            ? void 0
            : _h.HREF)
        : ''),
      (res.dates = this.convertToArray(data.DATES.DATE)
        .map((date) => ({
          deadline: date.OVERRIDE,
          decision: date.OVERRIDE2,
          start: date.TERM_START,
          end: date.TERM_END,
          term: date.APP_TERM,
          year: date.APP_YEAR
        }))
        .reverse()),
      (res.locations = this.convertToArray(data.LOCATIONS.LOCATION).map(
        (loc) => ({
          city: loc.PROGRAM_CITY,
          country: loc.PROGRAM_COUNTRY,
          region: loc.PROGRAM_REGION,
          longitude: loc.PROGRAM_LONGITUDE,
          latitude: loc.PROGRAM_LATITUDE
        })
      ));
    var index = this.searchResults.findIndex((i) => i.id === res.id);
    index >= 0 && (this.searchResults[index] = res);
  }
  confirmSearchElements() {
    return __async(this, null, function* () {
      this.curSearchElementURL = this.generateElementURL();
      var data = yield $.getJSON(this.curSearchElementURL);
      return this.saveSearchElements(data), this;
    });
  }
  refineSearchElements() {
    return __async(this, null, function* () {
      var url = this.generateResultsURL(!0),
        data = yield $.getJSON(url),
        refinableElements = this.basePossibleElements.filter(
          (el) => !!el.searchID
        );
      return (
        this.searchElements
          .filter((el) => refinableElements.some((i) => i.searchURL === el.id))
          .map((el) => {
            var key = this.convertID(el.id, 'searchID');
            el.values = data.PROGRAM.map((p) => p[key]).filter(this.onlyUnique);
          }),
        this
      );
    });
  }
  confirmSearchResults() {
    return __async(this, null, function* () {
      var _a;
      this.registeredResults.some((res) => res.id === this.customID) &&
        (null ==
          (_a = this.registeredResults.find(
            (res) => res.id === this.customID
          )) ||
          _a.value.forEach((custom) => {
            var _a2;
            var el = this.searchElements.find(
                (el2) => el2.id === this.customID
              ),
              cu =
                null == (_a2 = null == el ? void 0 : el.values)
                  ? void 0
                  : _a2.find((cus) => cus.value === custom);
            (null == cu ? void 0 : cu.search) && (null == cu || cu.search());
          }),
        (this.registeredResults = this.registeredResults.filter(
          (res) => res.id !== this.customID
        ))),
        (this.curSearchResultsURL = this.generateResultsURL());
      var data = yield $.getJSON(this.curSearchResultsURL);
      return this.saveSearchResults(data), this;
    });
  }
  refineProgram(id) {
    return __async(this, null, function* () {
      this.checkProgramValid(id);
      var url = this.generateProgramDataURL(id),
        data = yield $.getJSON(url);
      return this.saveProgramData(data), this;
    });
  }
  changePrivacy(index, isPrivate) {
    return (this.registeredElements[index].private = isPrivate), this;
  }
  changePermanency(index, isPermanent) {
    return (this.registeredResults[index].permanent = isPermanent), this;
  }
  resetRegisteredElements() {
    (this.curSearchElementURL = ''), (this.registeredElements = []);
  }
  resetRegisteredResults() {
    (this.curSearchResultsURL = ''),
      (this.curSearchResultsVerbiage = ''),
      (this.registeredResults = this.registeredResults.filter(
        (res) => res.permanent
      ));
  }
  searchFor(index, value) {
    return (
      this.registeredResults[index].value.push(value),
      {
        or: (val) => this.searchFor(index, val),
        makePermanent: () => this.changePermanency(index, !0),
        makeTemporary: () => this.changePermanency(index, !1)
      }
    );
  }
  searchIn(id) {
    this.checkSearchValueValid(id),
      this.readyForResults() && this.resetRegisteredResults(),
      this.registeredResults.every((el) => el.id !== id) &&
        this.registeredResults.push({
          id: id,
          value: [],
          permanent: !1
        });
    var index = this.registeredResults.findIndex((el) => el.id === id);
    return {
      for: (value) => this.searchFor(index, value)
    };
  }
  registerSearchElement(id) {
    this.checkSearchElementValid(id),
      this.readyToSearch() && this.resetRegisteredElements(),
      this.registeredElements.every((el) => el.id !== id) &&
        this.registeredElements.push({
          id: id,
          private: !1
        });
    var index = this.registeredElements.findIndex((el) => el.id === id);
    return {
      makePrivate: () => this.changePrivacy(index, !0),
      makePublic: () => this.changePrivacy(index, !1)
    };
  }
  registerCustomSearch(value, name, searchFunction) {
    var _a, _b;
    this.searchElements.some((el) => el.id === this.customID) ||
      this.searchElements.unshift({
        id: this.customID,
        name: this.customName,
        type: void 0,
        values: [],
        private: !1
      }),
      null ==
        (_b =
          null ==
          (_a = this.searchElements.find((el) => el.id === this.customID))
            ? void 0
            : _a.values) ||
        _b.push({
          value: value,
          name: name,
          search: searchFunction
        });
  }
}

window.TDDriver = TDDriver;
window.__async = __async;
