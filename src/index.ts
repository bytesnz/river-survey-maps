import Map from './lib/map';
import * as Controls from './lib/controls';
import Surveys from './surveys';
import Time from './lib/time';
import config from './config';

import './rivermaps.scss';
import '../node_modules/leaflet/dist/leaflet.css';
import '../node_modules/nouislider/distribute/nouislider.min.css';

let mapElement = document.getElementById('map');

let controlsLayer = document.getElementById('controls');

let controlsButton = document.querySelector('#controls > button');

let disableBubbling = (event: Event) => {
  event.stopPropagation();
};

// Disable bubbling on any events so clicks etc don't get passed to the map
['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'scroll'].forEach((event) => {
  controlsLayer.addEventListener(event, disableBubbling);
});

if (controlsButton) {
  controlsButton.addEventListener('click', (event) => {
    controlsLayer.classList.toggle('open');
    event.preventDefault();
  });
}

// Create map
Map(mapElement);

// Create time selection controls
let timeSection = Controls.addControlSection('Time', controlsLayer);
Time(timeSection);

// Add survey
Surveys(controlsLayer);

// Time type select buttons
var timeButtons = document.querySelectorAll('.time button');
