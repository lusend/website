/* Get URL Parameter */
function urlParameter(name, value = undefined, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&](' + name + ')(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (value === undefined) {
    if (!results) return null;
    if (!results[3]) return '';
    return decodeURIComponent(results[3].replace(/\+/g, ' '));
  } else {
    if (results)
      return url.replace(
        results[0],
        results[0][0] + name + '=' + encodeURIComponent(value)
      );

    return (
      url +
      (url.includes('?') ? '&' : '?') +
      name +
      '=' +
      encodeURIComponent(value)
    );
  }
}

/* Function used to push and pull URL History State */
function checkHistory() {
  /* Check if loading from a push State */
  if (urlParameter('preload')) {
    /* Add values to search bar. Wrapped in case of failure. Submission matters, this does not */
    try {
      $('#lusend-search')[0].selectize.clear();
      urlParameter('preloadValues')
        .split('%7F')
        .forEach((item) => {
          $('#lusend-search')[0].selectize.addItem(item);
        });
      $('#lusend-search')[0].selectize.refreshItems();
    } catch (e) {
      console.error(e);
    }

    /* Submit the form */
    afterSubmit(JSON.parse(urlParameter('preload')));
  } else {
    mapDriver.resetMarkers();
    mapDriver.removeLoadingControl('map-markers-list');
    $('#lusend-search')[0].selectize.clear();
    $('#lusend-search')[0].selectize.refreshItems();
  }
}

/* Create the map driver */
var mapDriver = new MapDriver('AIzaSyBcNbHG1bp2W6CQ1j6Ylp-hfv1E7qE6hZk');

/* Create a new TD API driver */
var tdDriver = new TDDriver();

/* Will automatically search for a coordinator's trip based on the Coordinator Lookup Parameter */
function searchCoordinator(e, combo) {
  __async(this, null, function* () {
    mapDriver.toggleShowID(true);

    try {
      tdDriver.searchIn('11049').for(combo).makeTemporary();
      afterSubmit([{ id: 'p_11049', value: combo }]);
    } catch (e) {
      console.error(e);
    }
  });
}

window.addEventListener('load', function () {
  /* Bind alt+1 to show ID's when necessary */
  Mousetrap.bind('alt+1', function () {
    __async(this, null, function* () {
      mapDriver.toggleShowID();

      try {
        if (mapDriver.getCount()) yield mapDriver.updateMarkerList();
        else afterSubmit([]);
      } catch (e) {
        console.error(e);
      }
    });
  });

  /* Binds each letter to a possible coordinator */
  'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .forEach((letter) => Mousetrap.bind(letter, searchCoordinator));

  (function () {
    __async(this, null, function* () {
      /* Iniitialize all map driver scripts and listeners */
      try {
        yield mapDriver.init();
      } catch (e) {
        console.error(e);
      }

      /* Create a loading sign while the search elements are generated */
      try {
        yield mapDriver.addLoadingControl('TOP_CENTER', 'lusend-temporary');
      } catch (e) {
        console.error(e);
      }

      /* Register new search elements to allow public searches from map */
      /* Registration order matters. This dictates the order they appear in the search */
      tdDriver.registerSearchElement('City').makePublic();
      tdDriver.registerSearchElement('Country').makePublic();
      tdDriver.registerSearchElement('Region').makePublic();
      tdDriver.registerSearchElement('11010').makePublic(); // Courses
      tdDriver.registerSearchElement('11034').makePublic(); // Schools
      tdDriver.registerSearchElement('11035').makePublic(); // Departments
      tdDriver.registerSearchElement('11029').makePublic(); // Terms
      tdDriver.registerSearchElement('ProgramName').makePublic();

      /* Register new search elements to allow private searches from code */
      tdDriver.registerSearchElement('ProgramType').makePrivate();
      tdDriver.registerSearchElement('Term').makePrivate(); // Official Terms
      tdDriver.registerSearchElement('11009').makePrivate(); // LU Send Map
      tdDriver.registerSearchElement('11049').makePrivate(); // Coordinator

      /* Solidifies registered search elements */
      try {
        yield tdDriver.confirmSearchElements();
      } catch (e) {
        console.error(e);
      }

      /* Add permanent searches here */
      /* Only include faculty led programs */
      tdDriver.searchIn('11009').for('Faculty-Led Programs').makePermanent();

      /* Optional, but does constrain location information and populates program name */
      /* After permanent searches so that program names that are inaccessible are not listed */
      try {
        yield tdDriver.refineSearchElements();
      } catch (e) {
        console.error(e);
      }

      /* Add custom searches here */
      /* All Programs. Returns nothing, since not filters aree needed */
      tdDriver.registerCustomSearch('allPrograms', 'All Trips', () => {
        return;
      });

      /* Domestic programs. Filters for programs in the US */
      tdDriver.registerCustomSearch(
        'domesticPrograms',
        'Domestic Trips',
        () => {
          tdDriver.searchIn('Country').for('United States').makeTemporary();
          return;
        }
      );

      tdDriver.registerCustomSearch('genedPrograms', 'GenEd Trips', () => {
        tdDriver
          .searchIn('11010')
          .for('ENGL 101')
          .or('COMS 101')
          .or('ENGR 270')
          .or('GLST 220')
          .or('SCOM 110')
          .or('MATH 114')
          .or('MATH 115')
          .or('MATH 117')
          .or('MATH 121')
          .or('MATH 122')
          .or('MATH 125')
          .or('MATH 126')
          .or('MATH 128')
          .or('MATH 130')
          .or('MATH 131')
          .or('MATH 132')
          .or('MATH 201')
          .or('MATH 211')
          .or('MATH 217')
          .or('MATH 227')
          .or('BIOL 101')
          .or('BIOL 102')
          .or('BIOL 103')
          .or('BIOL 104')
          .or('BIOL 203')
          .or('BIOL 213')
          .or('BIOL 214')
          .or('BIOL 215')
          .or('BIOL 216')
          .or('BIOL 224')
          .or('CHEM 105')
          .or('CHEM 107')
          .or('CHEM 121')
          .or('CHEM 122')
          .or('ENVR 215')
          .or('ENVR 220')
          .or('ENVR 221')
          .or('PHSC 121')
          .or('PHSC 122')
          .or('PHSC 210')
          .or('PHSC 211')
          .or('PHYS 101')
          .or('PHYS 103')
          .or('PHYS 201')
          .or('PHYS 202')
          .or('PHYS 231')
          .or('PHYS 232')
          .or('BUSI 201')
          .or('INFT 102')
          .or('INFT 103')
          .or('INFT 104')
          .or('INFT 110')
          .or('INFT 126')
          .or('INFT 127')
          .or('INFT 151')
          .or('INFT 152')
          .or('INFT 241')
          .or('UNIV 101')
          .or('INQR 101')
          .or('ARTS 209')
          .or('ENGL 102')
          .or('MUSC 200')
          .or('CSIS 110')
          .or('CSIS 111')
          .or('CSIS 112')
          .or('GEOG 200')
          .or('HIEU 201')
          .or('HIEU 202')
          .or('HLTH 216')
          .or('HIUS 221')
          .or('HIUS 223')
          .or('HIUS 222')
          .or('HIUS 341')
          .or('HIUS 360')
          .or('HIUS 380')
          .or('HIWD 370')
          .or('RSCH 201')
          .or('ARTS 205')
          .or('ARTS 214')
          .or('ENGL 201')
          .or('ENGL 202')
          .or('ENGL 215')
          .or('ENGL 216')
          .or('ENGL 221')
          .or('ENGL 222')
          .or('MUSC 213')
          .or('MUSC 314')
          .or('MUSC 371')
          .or('BIBL 105')
          .or('BIBL 110')
          .or('EVAN 101')
          .or('RLGN 105')
          .or('THEO 201')
          .or('THEO 202')
          .or('APOL 201')
          .or('ARTS 105')
          .or('CINE 101')
          .or('CSTU 101')
          .or('CSTU 102')
          .or('GLST 290')
          .or('MUSC 103')
          .or('MUSC 311')
          .or('MUSC 312')
          .or('MUSC 313')
          .or('THEA 101')
          .or('YOUT 220')
          .or('BUSI 223')
          .or('BUSI 240')
          .or('ECON 110')
          .or('ECON 213')
          .or('ECON 214')
          .or('GOVT 200')
          .or('GOVT 210')
          .or('GOVT 220')
          .or('PSYC 101')
          .or('PSYC 150')
          .or('PSYC 210')
          .or('SOCI 200')
          .or('SOCI 201')
          .or('PHIL 201')
          .or('BWVW 301')
          .or('CINE 340')
          .or('CSTU 301')
          .or('CSTU 310')
          .or('ENGL 405')
          .or('ENGL 442')
          .or('ENGL 460')
          .or('ENGL 462')
          .or('ETHM 411')
          .or('GEOG 410')
          .or('HIEU 466')
          .or('HLTH 400')
          .or('INDS 499')
          .or('MUSC 424')
          .or('NASC 315')
          .or('PHIL 429')
          .or('PHIL 465')
          .or('PHIL 468')
          .or('PHSC 310')
          .or('SPAN 324')
          .or('THEO 324')
          .or('THEO 340')
          .or('CSER')
          .makeTemporary();
      });

      /* Now that the search elements are generated, remove the loading sign */
      mapDriver.removeLoadingControl('lusend-temporary');

      /* Create the search bar */
      try {
        var title = 'Search Programs';
        if ($('#pagenav a:contains(Admin Console)').length >= 1) {
          title += ' (or press Alt+1)';
        }

        yield mapDriver.addSelectize(
          'TOP_LEFT',
          tdDriver.searchElements,
          title,
          'lusend-search',
          afterSubmit
        );
      } catch (e) {
        console.error(e);
      }

      window.addEventListener('popstate', checkHistory);

      checkHistory();
    });
  })();
});

function afterSubmit(values) {
  __async(this, null, function* () {
    /* Add new values to history */
    if (JSON.stringify(values) !== urlParameter('preload')) {
      /* Create a new link with values stored */
      var newLink = urlParameter('preload', JSON.stringify(values));
      /* Also store the search values */
      newLink = urlParameter(
        'preloadValues',
        $('#lusend-search').val(),
        newLink
      );
      /* Push the state to the URL */
      window.history.pushState({ reload: newLink }, '', newLink);
    }

    /* Clear markers and results if any are displayed */
    mapDriver.resetMarkers();
    tdDriver.resetRegisteredResults();

    /* Register searches */
    values.forEach((val) => {
      if (val.id && val.value)
        tdDriver.searchIn(val.id).for(val.value).makeTemporary();
    });

    /* Get search results */
    try {
      yield tdDriver.confirmSearchResults();
    } catch (e) {
      console.error(e);
    }

    /* Add the markers to the map */
    tdDriver.searchResults.forEach((trip) => {
      trip.locations.forEach((position, i1) => {
        mapDriver.addMarker(
          { lat: position.latitude, lng: position.longitude },
          trip.id,
          trip.name,
          `<div class='p-2 flex justify-center flex-col items-center'>
            <h3 class='text-xl font-bold mb-2 text-center'>${trip.name}</h3>
            <div class='prose'>
              <ul class='mb-2'>
                ${trip.locations
                  .map(
                    (position, i2) =>
                      `<li class='m-0 ${i1 === i2 ? 'font-bold' : ''}'>${
                        position.city
                      }, ${position.country} (${position.region})</li>`
                  )
                  .join('\n')}
              </ul>
            </div>
            <a href='https://liberty-sa.terradotta.com/index.cfm?FuseAction=Programs.ViewProgram&Program_ID=${
              trip.id
            }' class='btn btn-primary btn-block'>Learn More</button>
          </div>`,
          `https://liberty-sa.terradotta.com/index.cfm?FuseAction=Programs.ViewProgram&Program_ID=${trip.id}`
        );
      });
    });

    /* Center the map around the bounds of the markers */
    mapDriver.centerMap();

    /* Update the marker list */
    try {
      yield mapDriver.updateMarkerList(
        `<div class='text-lg text-center mb-2 max-h-28 overflow-y-auto'>${tdDriver.curSearchResultsVerbiage}</div>`
      );
    } catch (e) {
      console.error(e);
    }

    /* Ensure ethat the marker list is open */
    mapDriver.toggleMarkerList(true);
  });
}
