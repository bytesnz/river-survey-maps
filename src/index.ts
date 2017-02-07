import Map from './lib/map';
import * as Controls from './lib/controls';
import Surveys from './surveys';
import Time from './lib/time';
import config from './config';

import './rivermaps.scss';
import '../node_modules/leaflet/dist/leaflet.css';
import '../node_modules/nouislider/distribute/nouislider.min.css';

const mapElement = document.getElementById('map');

const controlsLayer = document.getElementById('controls');

const controlsButton = document.getElementById('controls-button');

const disableBubbling = (event: Event) => {
  event.stopPropagation();
};

let activeLayer: null | { button: HTMLElement, layer: HTMLElement };

const addControlButton = (button: HTMLElement, layer: HTMLElement): void => {
  if (button && layer) {
    button.addEventListener('click', (event) => {
      if (button.classList.contains('selected')) {
        activeLayer = null;
        button.classList.remove('selected');
        layer.classList.remove('open');
      } else {
        if (activeLayer) {
          activeLayer.button.classList.remove('selected');
          activeLayer.layer.classList.remove('open');
        }
        button.classList.add('selected');
        layer.classList.add('open');
        activeLayer = {
          button,
          layer
        };
      }
      event.preventDefault();
    });
  }
}

// Disable bubbling on any events so clicks etc don't get passed to the map
['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'scroll'].forEach((event) => {
  controlsLayer.addEventListener(event, disableBubbling);
});

if (controlsButton) {
  addControlButton(controlsButton, controlsLayer);
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
