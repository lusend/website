class MapDriver {
  constructor(
    APIKey,
    {
      MapID: MapID = 'map',
      maxZoom: maxZoom = 9,
      minZoom: minZoom = 1,
      initZoom: initZoom = 3,
      possibleColors: possibleColors = [
        '#001219',
        '#005f73',
        '#0a9396',
        '#94d2bd',
        '#e9d8a6',
        '#ee9b00',
        '#ca6702',
        '#bb3e03',
        '#ae2012',
        '#9b2226'
      ]
    } = {}
  ) {
    (this.initZoom = 3),
      (this.maxZoom = 9),
      (this.minZoom = 1),
      (this.markers = {}),
      (this.showID = !1),
      (this.visible =
        'M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z'),
      (this.invisible =
        'M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z'),
      (this.expand =
        'M21.92 11.62a1 1 0 0 0-.21-.33l-2.5-2.5a1 1 0 0 0-1.42 1.42l.8.79H14a1 1 0 0 0 0 2h4.59l-.8.79a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l2.5-2.5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76zM10 11H5.41l.8-.79a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0-.21.33a1 1 0 0 0 0 .76a1 1 0 0 0 .21.33l2.5 2.5a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-.8-.79H10a1 1 0 0 0 0-2z'),
      (this.shrink =
        'M10.71 11.29l-2.5-2.5a1 1 0 1 0-1.42 1.42l.8.79H3a1 1 0 0 0 0 2h4.59l-.8.79a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l2.5-2.5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76a1 1 0 0 0-.21-.33zM21 11h-4.59l.8-.79a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0-.21.33a1 1 0 0 0 0 .76a1 1 0 0 0 .21.33l2.5 2.5a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-.8-.79H21a1 1 0 0 0 0-2z'),
      (this.possibleColors = ['#0a254e']),
      (this.icons = {
        open: (color = '#cf3e3e') =>
          'data:image/svg+xml,' +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='5 2 14 20'><path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m4.5 7H14v5h-4V9H7.5L12 4.5z' fill='${color}'></path></svg>`
          ),
        multi: (color = '#cf3e3e') =>
          'data:image/svg+xml,' +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='3 2 18 20'><path d='M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9z' fill='${color}'></path></svg>`
          ),
        single: (color = '#cf3e3e') =>
          'data:image/svg+xml,' +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='5 2 14 20'><path d='M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z' fill='${color}'></path></svg>`
          )
      }),
      (this.APIKey = APIKey),
      (this.MapID = MapID),
      (this.maxZoom = maxZoom),
      (this.minZoom = minZoom),
      (this.initZoom = initZoom),
      (this.possibleColors = possibleColors);
  }
  getCount() {
    return Object.keys(this.markers).length;
  }
  getScripts() {
    return __async(this, null, function* () {
      yield this.getScript(
        'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/js/standalone/selectize.min.js'
      ),
        yield this.getCSS(
          'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/css/selectize.bootstrap4.min.css'
        ),
        yield this.getScript(
          'https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js'
        ),
        yield this.getScript(
          'https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.js'
        ),
        yield this.getScript(
          'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js'
        ),
        yield this.getScript(
          'https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.min.js'
        );
      var loader = new google.maps.plugins.loader.Loader({
        apiKey: this.APIKey,
        version: 'weekly'
      });
      yield loader.load();
    });
  }
  toggleShowID(state = undefined) {
    this.showID = state !== undefined ? state : !this.showID;
    return this.showID;
  }
  closeInfoWindow() {
    this.lastMarker &&
      this.lastMarker.setIcon({
        url: this.icons.single(this.lastMarker.get('color'))
      }),
      this.toggleMarkerList(!1),
      (this.lastMarker = null),
      this.info.close();
  }
  addEventListeners() {
    google.maps.event.addListener(this.map, 'idle', () => {
      Object.getPrototypeOf(this.oms).formatMarkers.call(this.oms);
    }),
      google.maps.event.addListener(
        this.map,
        'click',
        this.closeInfoWindow.bind(this)
      ),
      google.maps.event.addListener(
        this.cluster,
        'click',
        this.closeInfoWindow.bind(this)
      );
  }
  init() {
    return __async(this, null, function* () {
      yield this.getScripts(),
        (this.map = new google.maps.Map(document.getElementById(this.MapID), {
          center: {
            lat: 34.033,
            lng: -6.85
          },
          zoom: this.initZoom,
          maxZoom: this.maxZoom,
          minZoom: this.minZoom,
          gestureHandling: 'greedy',
          mapTypeID: google.maps.MapTypeId.HYBRID,
          streetViewControl: !1,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            style: google.maps.MapTypeControlStyle.DEFAULT,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.HYBRID
            ]
          },
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          backgroundColor: '#0a254e'
        })),
        (this.oms = new OverlappingMarkerSpiderfier(this.map, {
          markersWontMove: !0,
          markersWontHide: !0,
          keepSpiderfied: !0
        })),
        (this.cluster = new markerClusterer.MarkerClusterer({
          map: this.map,
          algorithm: new markerClusterer.SuperClusterAlgorithm({
            maxZoom: this.maxZoom - 1
          })
        })),
        this.resetMarkers(),
        yield this.addControlToggle(),
        this.addEventListeners();
    });
  }
  toggleMarkerList(force) {
    !0 === force && $('#map-markers-list-icon path').attr('d', this.expand),
      !1 === force && $('#map-markers-list-icon path').attr('d', this.shrink),
      $('#map-markers-list-icon path').attr('d') === this.shrink
        ? ($('#map-markers-list-icon path').attr('d', this.expand),
          $('#map-markers-list').css('max-width', '0px'),
          $('#map-markers-list').css('padding', '0px'))
        : ($('#map-markers-list-icon path').attr('d', this.shrink),
          $('#map-markers-list').css('max-width', '70%'),
          $('#map-markers-list').css('padding', '0.65rem'));
  }
  updateMarkerList(headerElement) {
    return __async(this, null, function* () {
      $('#map-markers-list').length || (yield this.addMarkerList()),
        headerElement
          ? ($('#map-markers-list .list-content').html(''),
            $('#map-markers-list .list-content').append(
              $("<div class='list-header'></div>").append(
                headerElement,
                `<div style='text-align: center; margin-bottom: 0.5rem;'><strong>${
                  Object.keys(this.markers).length
                }</strong> Found</div>`
              )
            ))
          : $('#map-markers-list .list-content>*:not(.list-header)').remove(),
        Object.keys(this.markers)
          .sort((a, b) =>
            this.markers[a]
              .get('name')
              .localeCompare(this.markers[b].get('name'))
          )
          .forEach((id) => {
            var marker = this.markers[id];
            $('#map-markers-list .list-content').append(
              '<hr>',
              $("<div class='list-markers'>").append(
                $('<a>')
                  .append(
                    "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='24' height='24' preserveAspectRatio='xMidYMid meet' viewBox='2 2 20 20'><path d='M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 10.5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 9.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m0-5.3c-2.1 0-3.8 1.7-3.8 3.8c0 3 3.8 6.5 3.8 6.5s3.8-3.5 3.8-6.5c0-2.1-1.7-3.8-3.8-3.8z' fill='currentColor'></path></svg>"
                  )
                  .on('click', () => {
                    this.showMarker(id), this.toggleMarkerList(!1);
                  }),
                `<span>${this.showID ? `(${marker.get('id')})` : ''}</span>`,
                $(`<a href='${marker.get('link') || '#'}'>`).append(
                  `<strong>${marker.get('name')}</strong>`
                )
              )
            );
          });
    });
  }
  addLoadingControl(position, id) {
    return __async(this, null, function* () {
      yield this.addControl(
        position,
        $(
          `<div id='${id}' style='margin: 10px'><svg class='animate-spin' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z' fill='currentColor'></path></svg></div>`
        )[0],
        id
      );
    });
  }
  removeLoadingControl(id) {
    $(`#${id}`).remove();
  }
  addMarkerList() {
    return __async(this, null, function* () {
      $('#map-markers-list').remove(),
        yield this.addControl(
          'LEFT_CENTER',
          $("<div id='map-markers-list'></div>")[0],
          'map-markers-list'
        ),
        $('#map-markers-list').append("<div class='list-content'></div>"),
        $('#map-markers-list').append("<div class='list-toggle'></div>"),
        $('#map-markers-list .list-toggle').append(
          `<svg id='map-markers-list-icon' style='padding: 10px 0px' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='${this.shrink}' fill='#0a254e'></path></svg>`
        ),
        google.maps.event.addDomListener(
          $('#map-markers-list .list-toggle')[0],
          'click',
          this.toggleMarkerList.bind(this)
        );
    });
  }
  toggleControls(force) {
    !0 === force && $('#control-toggle path').attr('d', this.visible),
      !1 === force && $('#control-toggle path').attr('d', this.invisible),
      $('#control-toggle path').attr('d') === this.visible
        ? ($('#control-toggle path').attr('d', this.invisible),
          $('#map .gm-style > iframe ~ div:not(#control-toggle-parent)').hide(
            300
          ))
        : ($('#control-toggle path').attr('d', this.visible),
          $('#map .gm-style > iframe ~ div:not(#control-toggle-parent)').show(
            300
          ));
  }
  addControlToggle() {
    return __async(this, null, function* () {
      yield this.addControl(
        'RIGHT_TOP',
        $(
          `<svg id='control-toggle' style='right: 0px; margin: 15px 10px; z-index: 2;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='32' height='32' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='${this.visible}' fill='#0a254e'></path></svg>`
        )[0],
        'control-toggle'
      ),
        $('#control-toggle').parent().attr('id', 'control-toggle-parent'),
        google.maps.event.addDomListener(
          $('#control-toggle')[0],
          'click',
          this.toggleControls.bind(this)
        );
    });
  }
  addMarker(position, id, name, element, link = '') {
    var color =
        this.possibleColors[
          Object.keys(this.markers).length % this.possibleColors.length
        ],
      marker = new google.maps.Marker({
        position: position,
        animation: google.maps.Animation.DROP
      });
    return (
      marker.set('color', color),
      marker.set('name', name),
      marker.set('id', id),
      marker.set('link', link),
      google.maps.event.addListener(marker, 'spider_click', () => {
        this.lastMarker !== marker
          ? (this.info.setContent(
              `<div id='info-${id}'>${$(element)[0].outerHTML}</div>`
            ),
            this.info.setOptions({
              disableAutoPan: !1
            }),
            this.info.open({
              anchor: marker,
              map: this.map,
              shouldFocus: !1
            }),
            setTimeout(() => {
              this.info.setOptions({
                disableAutoPan: !0
              });
            }, 1),
            marker.setIcon({
              url: this.icons.open(marker.get('color'))
            }),
            this.lastMarker &&
              this.lastMarker.setIcon({
                url: this.icons.single(this.lastMarker.get('color'))
              }),
            (this.lastMarker = marker))
          : (this.info.close(),
            marker.setIcon({
              url: this.icons.single(marker.get('color'))
            }),
            (this.lastMarker = null));
      }),
      google.maps.event.addListener(marker, 'spider_format', (status) => {
        var icon =
          status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED
            ? this.icons.single
            : status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE
            ? this.icons.multi
            : (OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE,
              this.icons.single);
        marker.setIcon({
          url: icon(marker.get('color'))
        });
      }),
      this.oms.addMarker(marker),
      this.cluster.addMarker(marker),
      this.bounds.extend(marker.position),
      (this.markers[id] = marker),
      this
    );
  }
  centerMap() {
    this.map.fitBounds(this.bounds, {
      top: 100,
      left: 100,
      bottom: 100
    });
  }
  resetMarkers() {
    this.oms.removeAllMarkers(),
      this.cluster.clearMarkers(),
      (this.markers = {}),
      (this.bounds = new google.maps.LatLngBounds()),
      (this.info = new google.maps.InfoWindow({
        content: '',
        disableAutoPan: !1
      }));
  }
  showMarker(id) {
    this.toggleMarkerList(!1);
    var marker = this.markers[id];
    this.map.setZoom(this.maxZoom),
      this.map.panTo(marker.getPosition()),
      setTimeout(() => {
        this.oms.markersNearMarker(marker, !0).length &&
          google.maps.event.trigger(marker, 'click'),
          google.maps.event.trigger(marker, 'spider_click');
      }, 150);
  }
  addControl(position, element, id) {
    return new Promise((resolve) => {
      var interval = setInterval(() => {
        $(`#${id}`).length && (clearInterval(interval), resolve(element));
      }, 100);
      this.map.controls[google.maps.ControlPosition[position]].push(element);
    });
  }
  cleanseOptions(opts) {
    return [
      opts.reduce(
        (res, opt) =>
          res.concat(
            opt.values.map((val) => {
              var res2 = {};
              return (
                (null == val ? void 0 : val.hasOwnProperty('value')) ||
                  (val = {
                    value: val,
                    name: val
                  }),
                (res2.value = opt.id + '%2C' + val.value),
                (res2.name = val.name),
                (res2.group = opt.id),
                res2
              );
            })
          ),
        []
      ),
      opts
    ];
  }
  addSelectize(_0) {
    return __async(
      this,
      arguments,
      function* (
        position,
        opts = [],
        placeholder = 'Search...',
        id = 'search',
        submitCallback
      ) {
        yield this.addControl(
          position,
          $(
            `<div class='selectizer' style='z-index: 1'><input type='text' id='${id}'></input><button id='${id}-submit' class='btn btn-primary'>Submit</button></div>`
          )[0],
          id
        );
        var [options, optgroups] = this.cleanseOptions(opts);
        $(`#${id}`).selectize({
          valueField: 'value',
          labelField: 'name',
          searchField: 'name',
          optgroupValueField: 'id',
          optgroupLabelField: 'name',
          optgroupField: 'group',
          lockOptgroupOrder: !0,
          selectOnTab: !0,
          plugins: ['remove_button', 'restore_on_backspace'],
          delimiter: '%7F',
          options: options,
          optgroups: optgroups,
          placeholder: placeholder
        }),
          google.maps.event.addDomListener(
            $(`#${id}-submit`)[0],
            'click',
            () => {
              submitCallback(
                $(`#${id}`)
                  .val()
                  .split('%7F')
                  .map((v) => {
                    var [id2, value] = v.split('%2C');
                    return {
                      id: id2,
                      value: value
                    };
                  })
              );
            }
          );
      }
    );
  }
  getScriptCached(url) {
    return $.ajax({
      url: url,
      dataType: 'script',
      cache: !0
    });
  }
  getScript(url) {
    return new Promise((resolve, reject) => {
      this.getScriptCached(url)
        .done(function (script) {
          resolve(script);
        })
        .fail(function (script) {
          reject(script);
        });
    });
  }
  getCSS(url) {
    return __async(this, null, function* () {
      $('head').append(`<link rel='stylesheet' href='${url}' />`);
    });
  }
}

window.MapDriver = MapDriver;
