import Map from './lib/map';
import * as Controls from './lib/controls';
import Surveys from './surveys';
import Time from './lib/time';
import config from './config';
import Timescale from './lib/timescale';

let mapElement = document.getElementById('map');

let controlsLayer = document.getElementById('controls');

let disableBubbling = (event: Event) => {
  event.stopPropagation();
};

// Disable bubbling on any events so clicks etc don't get passed to the map
['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'scroll'].forEach((event) => {
  controlsLayer.addEventListener(event, disableBubbling);
});

// Create map
Map(mapElement);

let timescale = Timescale(document.getElementById('timescale'));

// Create time selection controls
let timeSection = Controls.addControlSection('Time', controlsLayer);
Time(timeSection);

// Add survey
Surveys(controlsLayer, timescale);

// Time type select buttons
var timeButtons = document.querySelectorAll('.time button');
