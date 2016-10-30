var mapElement = document.getElementById('map');
// Set the height of the map element to 50% of the window height
var resizeMap = () => {
  var height;

  if (typeof (height = window.innerHeight) === 'undefined') {
    height = window.clientHeight;
  }

  mapElement.style.height = (height / 2) + 'px';
};

resizeMap();

var map = L.map(mapElement, {
  // maxBounds: bounds // to limit map to certain area
}).setView([51.505, -0.09], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //user: 'mapbox',
    //mapId: 'streets-v10',
    user: 'bytesnz',
    mapId: 'ciulsfir300cm2jl8ky8x0l7d',
    accessToken: 'pk.eyJ1IjoiYnl0ZXNueiIsImEiOiJjaXU3ZGJyOG8wMDAwMnlsZWFyNnNpYXNpIn0.6sHotnFHXFsS8ZZHAoOVgA'
}).addTo(map);
var mapMoveTimeout;

var halflifeLengths = [
  ['1 hour', 3600000],
  ['1 day', 86400000],
  ['1 week', 604800000],
  ['1 month', 2592000000],
  ['1 year', 31536000000]
];

var defaultMarkerOptions = {
  color: '#ffffff',
  interactive: true,
  weight: 2
};

var expiredSaturation = 0;
var decaySaturation = false;
var expiredLightness = 60;
var decayLightness = false;
var decayOpacity = true;
var startSurveysEnabled = false;
var defaultTime = 'decaying';

var timeSlider = document.getElementById('timeSlider');

var activeSurveys = [];

var surveyData = {};

/**
 * Returns the Leaflet LatLng object for a given survey
 *
 * @param {Object} survey Survey to create the latlng for
 *
 * @returns {LatLng} LatLng for given survey
 */
var pointLatlng = (survey) => {
  return L.latLng([survey.location._wgs84[1], survey.location._wgs84[0]]);
};

/**
 * Generates the color for the given survey based off the survey type,
 * survey time and survey result.
 *
 * @param {Object} survey Survey to create the color for
 *
 * @returns {String} CSS color string, in HSL format
 */
var pointColor = (survey) => {
  var score = 0;
  var items = 0;
  var currentTime = (new Date()).getTime();
  var h, s, l, o = 1;
  var value;

  switch (survey.layer) {
    case 'thames21ThamesWaterQuality':
      // pH
      if (surveyParts['waterQuality'].indexOf('ph') !== -1) {
        value = survey.attributes.thames21Ph;
        if (surveyParts['waterQuality'].length === 1) {
          switch (survey.attributes.thames21Ph) {
            case 1:
              h = 358;
              s = 80;
              l = 51;
              break;
            case 2:
              h = 26;
              s = 85;
              l = 53;
              break;
            case 3:
              h = 35;
              s = 90;
              l = 54;
              break;
            case 4:
              h = 45;
              s = 91;
              l = 52;
              break;
            case 5:
              h = 52;
              s = 94;
              l = 50;
              break;
            case 6:
              h = 58;
              s = 90;
              l = 51;
              break;
            case 7:
              h = 65;
              s = 68;
              l = 51;
              break;
            case 8:
              h = 74;
              s = 51;
              l = 54;
              break;
            case 9:
              h = 170;
              s = 22;
              l = 57;
              break;
            case 10:
              h = 202;
              s = 54;
              l = 50;
              break;
            case 11:
              h = 211;
              s = 52;
              l = 51;
              break;
            case 12:
              h = 217;
              s = 48;
              l = 48;
              break;
            case 13:
              h = 251;
              s = 34;
              l = 47;
              break;
            case 14:
              h = 264;
              s = 40;
              l = 43;
              break;
          }
        } else {
          switch (survey.attributes.thames21Ph) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
              score += 4;
              items++;
              break;
            case 6:
            case 9:
              score += 1
              items++;
              break;
            case 7:
            case 8:
              items++;
              break;
          }
        }
      }

      // Temperature
      if (surveyParts['waterQuality'].indexOf('temp') !== -1) {
        value = survey.attributes.thames21Temperature;
        if (surveyParts['waterQuality'].length === 1) {
          if (value < 3) {
            h = 238;
            s = 52;
            l = 38;
          } else if (value < 6) {
            h = 214;
            s = 86;
            l = 34;
          } else if (value < 9) {
            h = 206;
            s = 100;
            l = 35;
          } else if (value < 12) {
            h = 202;
            s = 100;
            l = 39;
          } else if (value < 15) {
            h = 199;
            s = 100;
            l = 43;
          } else if (value < 18) {
            h = 196;
            s = 100;
            l = 47;
          } else if (value < 21) {
            h = 188;
            s = 95;
            l = 39;
          } else if (value < 24) {
            h = 173;
            s = 24;
            l = 54;
          } else if (value < 29) {
            h = 27;
            s = 83;
            l = 53;
          } else { // 29+
            h = 354;
            s = 73;
            l = 43;
          }
        } else {
          items++;
          if (value < 21) {
          } else if (value < 24) {
            score += 1;
          } else if (value < 29) {
            score += 2;
          } else { // 29+
            score += 4;
          }
        }
      }
      break;
  }


  if (items) {
    // Set color based on average score - good ok bad
    switch (Math.round(score / items)) {
      case 0: // Excellent
        h = 114;
        s = 63;
        l = 54;
        break;
      case 1: // Good
        h = 74;
        s = 51;
        l = 54;
        break;
      case 2: // Moderate
        h = 52;
        s = 94;
        l = 50;
        break;
      case 3: // Poor
        h = 14;
        s = 88;
        l = 55;
        break;
      case 4: // Baaad
        h = 358;
        s = 80;
        l = 51;
        break;
    }
  }

  // grey it based on the halflife
  if (timeType === 'decaying') {
    // Get the halflife value
    var halflife = halflifeLengths[Math.round(timeSlider.noUiSlider.get())][1];
    //var halflife = halflifeLengths[4][1];

    // Calculate how many "decayed" the survey is
    var diff = currentTime - survey.timestamp._epoch;

    diff = diff / halflife;
    diff = 1 - Math.pow(0.5, diff);

    // Adjust saturation and lightness based of the diff;
    if (decaySaturation) {
      s  = Math.round(s - ((s - expiredSaturation) * diff));
    }
    if (decayLightness) {
      l  = Math.round(l - ((l - expiredLightness) * diff));
    }
    if (decayOpacity) {
      o = 1 - diff;
    }
  }

  if (typeof h === 'undefined') {
    return false;
  } else {
    return [h, s, l, o];
  }
};

/**
 * Checks that the survey data currently covers the
 * map and updates if required
 *
 * @param {String} survey Check only a specific survey
 *
 * @returns {udefined}
 */
var reloadData = (survey) => {
  var toFetch = [];

  // Get the bounds of the map
  var bounds = map.getBounds();

  var getParams = {
    ne: bounds.getNorth() + ',' + bounds.getEast(),
    sw: bounds.getSouth() + ',' + bounds.getWest()
  };

  console.log('checking data for', bounds, activeSurveys);


  var checkPreviousLoads = (survey) => {
    if (typeof requestedAreas[survey] !== 'undefined') {
      if (typeof (requestedAreas[survey].find((area) => {
        if (area.contains(bounds)) {
          return true;
        }
      })) === 'undefined') {
        toFetch.push(survey);
      }
    } else {
      toFetch.push(survey);
    }
  };

  // Check if previous requests for the given data contain the current bounds
  if (typeof survey !== 'string' && typeof surveys[survey] !== 'undefined') {
    checkPreviousLoads(survey);
  } else {
    activeSurveys.forEach(checkPreviousLoads);
  }

  // Request the data
  toFetch.forEach((survey) => {
    /*es6 var params = {
      ...getParams,
      ...surveys[survey].getParams
    };*/
    var params = _.extend({}, getParams, surveys[survey].getParams);

    // Build the get parameters
    var get = [];
    Object.keys(params).forEach((param) => {
      get.push(param + '=' + encodeURIComponent(params[param]));
    });
    if (get.length) {
      get = '?' + get.join('&');
    } else {
      get = '';
    }

    nanoajax.ajax({
      url: surveys[survey].url + get,
      headers: {
        Accept: 'javascript/json'
      }
    }, (code, responseText) => {
      var data;
      if (code === 200) {
        try {
          data = JSON.parse(responseText);
            console.log('get response for', surveys[survey].url, get, data);
        } catch (err) {
          console.error('Error parsing response', surveys[survey].url, get, responseText);
          return;
        }
        if (typeof data === 'object' && data.results && data.results instanceof Array) {
          addSurveyData(survey, data.results);
          redrawSurveyData(survey);
        } else {
          console.error('Unknown data received');
        }
      }
    });
  });

  if (typeof survey !== 'string' && typeof surveys[survey] !== 'undefined'
      && !toFetch.length) {
    redrawSurveyData(survey);
  }

}

/**
 * Focus on the given survey. Called with a survey event
 * is clicked on.
 */
var focusOnPoint = (point, event) => {
  console.log('Focussing on', point);
};

/**
 * Redraws the given survey layer
 *
 * @param {String} String identifier of the layer to redraw
 *
 * @returns {undefined}
 */
var redrawSurveyData = (survey) => {
  if (typeof surveyData[survey] !== 'undefined') {
    // Create layer group if we don't already have one
    if (typeof surveyLayers[survey] === 'undefined') {
      surveyLayers[survey] = L.layerGroup();
    } else {
      surveyLayers[survey].clearLayers();
    }

    // Build array of survey data to include, selected and order by date
    var surveyKeys = [];

    Object.keys(surveyData[survey]).forEach((point) => {
      // TODO time filtering
      var i = 0;

      while (i < surveyKeys.length) {
        if (surveyData[survey][point].timestamp._epoch < surveyData[survey][surveyKeys[i]].timestamp._epoch) {
          break;
        }
        i++;
      }

      surveyKeys.splice(i, 0, point);
    });

    // Go through survey data populating layer with markers
    surveyKeys.forEach((point) => {
      // Create latlong from data
      var latlng = pointLatlng(surveyData[survey][point]);

      // Get color for point
      var color = pointColor(surveyData[survey][point]);

      if (color) {
        // Create point
        var marker = L.circleMarker(latlng, _.extend({}, defaultMarkerOptions, {
          color: (surveyData[survey][point].status === 'approved' ? '#ffffff' : '#666666'),
          fillColor: 'hsl(' + color[0] + ', ' + color[1] + '%, ' + color[2] + '%)',
          opacity: 1 - Math.pow(1 - color[3], 2),
          fillOpacity: color[3]
        }));

        // Attach events to marker
        //marker.addEventListener(focusOnPoint.bind(null, surveyData[survey][point]));

        // Add the point to the layer
        surveyLayers[survey].addLayer(marker);
      }
    });

    // Add layer to map if not already on it
    if (!map.hasLayer(surveyLayers[survey])) {
      map.addLayer(surveyLayers[survey]);
    }
  }
}

/**
 * Redraws all the active surveys
 *
 * @returns {undefined}
 */
var redrawAllActive = () => {
  activeSurveys.forEach(redrawSurveyData);
};

var mapChanged = (event) => {
  if (typeof mapMoveTimeout !== 'undefined') {
    clearTimeout(mapMoveTimeout);
    mapMoveTimeout = undefined;
  }

  setTimeout(() => {
    console.log('reload data');
    reloadData();
  }, 1000);
};

map.on('moveend', mapChanged);
map.on('zoomend', mapChanged);

var controlsLayer = document.getElementById('controls');

var disableBubbling = (event) => {
  event.stopPropagation();
};

// Disable bubbling on any events so clicks etc don't get passed to the map
['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'scroll'].forEach((event) => {
  controlsLayer.addEventListener(event, disableBubbling);
});

// Store the downloaded survey data
var surveyData = {};

// Stores the currently active layers and parts
var surveyLayers  = {};

// Store the requested areas
var requestedAreas = {};

var timeType;

/**
 * Adds new survey data to the survey store
 *
 * @param {String} type String identifier of survey type
 * @param {Array} data Array of data to add to object
 */
var addSurveyData = (type, data) => {
  if (typeof surveyData[type] !== 'object') {
    surveyData[type] = {};
  }

  data.forEach((survey) => {
    surveyData[type][survey._id['$oid']] = survey;
  });
};


// Available survey types
var surveys = {
  waterQuality: {
    label: 'Water Quality',
    layerId: 'thames21ThamesWaterQuality',
    parts: {
      ph: 'pH',
      temp: 'Temperature',
      turbidity: 'Turbidity',
      o2: 'Dissolved Oxygen',
      coliforms: 'Coliforms'
    },
    url: 'https://widget.cartographer.io/api/v1/map',
    getParams: {
      subdomain: 'thames21',
      layer: 'thames21ThamesWaterQuality'
    }
  },
  litter: {
    label: 'Litter Survey',
    layerId: 'thames21Litter',
    parts: {
      food: 'Food Related', // thames21LitterFoodRelated
      packaging: 'Packaging', // thames21LitterPackaging
      sewage: 'Sewage Related', // thames21LitterSewageRelated
      plastic: 'Plastic', // thames21LitterUnidentifiedPlastic
      other: 'Unidentified Polystyrene' // thames21LitterUnidentifiedPolystyrene
    },
    url: 'https://widget.cartographer.io/api/v1/map',
    getParams: {
      subdomain: 'thames21',
      layer: 'thames21ThamesLitter'
    }
  }
}

// Store the selected parts to the survey
var surveyParts = {
  waterQuality: ['ph', 'temp']
};

// Time type select buttons
var timeButtons = document.querySelectorAll('.time button');

/**
 * Handles an update to the slider value(s) by change the value text(s)
 *
 * @returns {undefined}
 */
var sliderUpdate = () => {
  // Update value
  switch (timeType) {
    case 'decaying':
      document.getElementById('lowerValue').innerText = halflifeLengths[Math.round(timeSlider.noUiSlider.get())][0];
      break;
  }
};

var selectTime = (type) => {
  // Clear

  timeButtons.forEach((button) => {
    if (button.id === type) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  if (timeType !== type) {
    timeType = type;

    // Update slider options
    switch (type) {
      case 'decaying':
        timeSlider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: halflifeLengths.length - 1
          }
        });
        timeSlider.noUiSlider.set([3]);
        // Update range labels
        document.getElementById('rangeTitle').innerHTML = 'Survey Halflife:';
        document.getElementById('minRange').innerHTML = halflifeLengths[0][0];
        document.getElementById('maxRange').innerHTML = halflifeLengths[halflifeLengths.length-1][0];
        break;
    }

    redrawAllActive();

    // Redraw
    //redrawData();
  } else {
    timeType = type;
  }

};

var allSurveysButton = document.getElementById('allSurveys');
/**
 * Toggles one or all of the surveys.
 *
 * @param {String} String identifier of the survey to toggle
 * @param {Event}
 *
 * @returns {undefined}
 */
var toggleSurvey = (survey, event) => {
  var index;
  var surveyKeys = Object.keys(surveys);

  if (survey) {
    if (typeof surveys[survey] !== 'undefined') {
      if ((index = activeSurveys.indexOf(survey)) !== -1) {
        // Disable
        activeSurveys.splice(index, 1);
        allSurveysButton.classList.remove('selected');
        if (surveys[survey].button) {
          surveys[survey].button.classList.remove('selected');
        }
        // Hide survey layer if created
        if (typeof surveyLayers[survey] !== 'undefined') {
          if (map.hasLayer(surveyLayers[survey])) {
            map.removeLayer(surveyLayers[survey]);
          }
        }
      } else {
        // Enable
        activeSurveys.push(survey);
        if (surveyKeys.length === activeSurveys.length) {
          allSurveysButton.classList.add('selected');
        }

        if (surveys[survey].button) {
          surveys[survey].button.classList.add('selected');
        }
        // Show survey layer if created
        if (typeof surveyLayers[survey] !== 'undefined') {
          if (!map.hasLayer(surveyLayers[survey])) {
            map.addLayer(surveyLayers[survey]);
          }
        }
        reloadData(survey);
        //redrawSurveyData(survey);
      }
    }
  } else {
    if (activeSurveys.length === 0 || surveyKeys.length !== activeSurveys.length) {
      // Toggle all non-active surveys
      surveyKeys.forEach((survey) => {
        if (activeSurveys.indexOf(survey) === -1) {
          toggleSurvey(survey);
        }
      });
      allSurveysButton.classList.add('selected');
    } else {
      // Toggle all surveys
      surveyKeys.forEach((survey) => {
          toggleSurvey(survey);
      });
      allSurveysButton.classList.remove('selected');
    }
  }
};


// Get the data points

var surveyElement = document.getElementById('surveys');
Object.keys(surveys).forEach((survey) => {
  // Add survey button
  var button;
  surveyElement.appendChild((button = document.createElement('button')));
  button.innerHTML = surveys[survey].label;
  button.addEventListener('click', toggleSurvey.bind(null, survey));
  surveys[survey].button = button;
  if (startSurveysEnabled) {
    button.classList.add('selected');
    activeSurveys.push(survey);
  }
});

// Add toggle listener onto the all button
allSurveysButton.addEventListener('click', toggleSurvey.bind(null, undefined));

// Attach listeners to time buttons
timeButtons.forEach((button) => {
  button.addEventListener('click', selectTime.bind(null, button.id));
});

noUiSlider.create(timeSlider, {
  start: [0],
  step: 1,
  range: {
    min: 0,
    max: halflifeLengths.length - 1
  }
});

timeSlider.noUiSlider.on('update', sliderUpdate);
timeSlider.noUiSlider.on('change', redrawAllActive);

// Default to decaying
selectTime(defaultTime);

if (startSurveysEnabled) {
  allSurveyButton.classList.add('selected');
  reloadData();
}
