import L = require('leaflet');
import config from '../config';

let mapElement: HTMLElement;
let mapListeners: Function[] = [];

export let map: L.Map;

/**
 * Set the height of the map. By default, the height will be 50% of the
 * window height
 *
 * @param {number} [height] Height (in px) to set the map to
 */
export function resizeMap(height?: number) {
  if (typeof height !== 'number') {
    if (typeof (height = window.innerHeight) === 'undefined') {
      height = document.body.clientHeight;
    }
    height = height * .80;
  }

  mapElement.style.height = height + 'px';
};


/**
 * Add a callback function to be called when the map view changes. Function
 * will be passed the event
 *
 * @param {Function} func Callback function
 *
 * @returns {number} ID of callback, which can be used to remove the callback
 */
export function addListener(func: Function) {
  let id: number;
  if ((id = mapListeners.indexOf(func)) !== -1) {
    return id;
  }

  return mapListeners.push(func) - 1;
};

/**
 * Removes a callback function from being called when the map view is changed.
 *
 * @param {function|number} item Callback function or callback function id to
 *   remove
 *
 * @returns {undefined}
 */
export function removeListener(item: number | Function) {
  let id: number;
  if (typeof item === 'number' && typeof mapListeners[item] !== 'undefined') {
    delete mapListeners[item];
  } else if (typeof item === 'function'
      && (id = mapListeners.indexOf(item)) !== -1) {
    delete mapListeners[id];
  }
};

// Mop event handling
let mapMoveTimeout: number;

let mapChanged = (event: Event) => {
  if (mapListeners.length) {
    if (typeof mapMoveTimeout !== 'undefined') {
      clearTimeout(mapMoveTimeout);
      mapMoveTimeout = undefined;
    }

    setTimeout(() => {
      console.log('calling map listeners');
      mapListeners.forEach((cb) => {
        cb(event);
      });
    }, 1000);
  }
};

/**
 * Focus on the given survey. Called with a survey event
 * is clicked on.
 *
 * @param {Position} point Point to center on map
 */
export function focusOnPoint(point: Position) {
  console.log('Focussing on', point);
};

/**
 * Creates a map and attaches event handlers to it
 *
 * @param {HTMLElement} element Element to to use for the creation of the
 *   map
 */
export default function create(element: HTMLElement) {
  mapElement = element;

  resizeMap();

  map = L.map(element, {
    // maxBounds: bounds // to limit map to certain area
  }).setView([51.505, -0.09], 12);

  // Add maps layer to map
  L.tileLayer('https://api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      //user: 'mapbox',
      //mapId: 'streets-v10',
      user: 'bytesnz',
      mapId: 'ciulsfir300cm2jl8ky8x0l7d',
      accessToken: 'pk.eyJ1IjoiYnl0ZXNueiIsImEiOiJjaXU3ZGJyOG8wMDAwMnlsZWFyNnNpYXNpIn0.6sHotnFHXFsS8ZZHAoOVgA'
  }).addTo(map);

  map.on('moveend', mapChanged);
  map.on('zoomend', mapChanged);
}
