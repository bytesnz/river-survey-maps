import config from '../config';

import noUiSlider = require('nouislider');

export let selectedTimeType: string;

let timeSlider: any;
let rangeDiv: HTMLElement;

let timeListeners: Function[] = [];

let minTime: Date;
let maxTime: Date;
let timeStep: number;

let lowerValue: HTMLElement;
let upperValue: HTMLElement;
let minLimit: HTMLElement;
let maxLimit: HTMLElement;
let limitSeparator: HTMLElement;
let rangeTitle: HTMLElement;

export let timeTypes = {
  none: {
    label: 'No limit',
  },
  decaying: {
    label: 'Decaying',
    description: 'The older the survey, the more opaque it is'
  },
  ranged: {
    label: 'Ranged'
  }
};

/**
 * Calculates the decay against the current halflife amount given either
 * a time amount, a date (the decay will be calculated against the current
 * time), or two current.
 *
 * @param {number | Date} amount Time amount or date to use in calculation of
 *   decay amount
 * @param {Date} date Date to calculate the decay for
 */
export function getDecayAmount(amount: number | Date, date?: Date) {
  if (selectedTimeType === 'decaying') {
    let halflife = config.halflifeLengths[Math.round(timeSlider.noUiSlider.get())].time;
    //var halflife = halflifeLengths[4][1];

    // Calculate how many "decayed" the survey is
    if (amount instanceof Date) {
      if (date instanceof Date) {
      } else if (typeof date === 'amount') {
        date = new Date(date);
      } else {
        date = new Date();
      }

      amount = date.getTime() - amount.getTime();
    }

    amount = amount / halflife;
    amount = 1 - Math.pow(0.5, amount);

    return amount;
  }
};

let callListeners = () => {
  timeListeners.forEach((callback) => {
    callback();
  })
};

/**
 * Add a listener to be called with the time type or time values are updated
 *
 * @param {Function} callback Function to call when the time type or values are
 *  are updated
 */
export function addListener(callback: Function) {
  timeListeners.push(callback);
};

/**
 * Sets the time type to the time type of the given id
 *
 * @param {string} type ID of the given time type
 *
 * @returns {undefined}
 */
export function selectTimeType(type: string) {
  if (typeof timeTypes[type] !== 'undefined') {
    Object.keys(timeTypes).forEach((time) => {
      let timeType = timeTypes[time];
      if (time === type) {
        timeType.button.classList.add('selected');
      } else {
        timeType.button.classList.remove('selected');
      }
    });

    // Update
    if (selectedTimeType !== type) {
      selectedTimeType = type;

      // Update slider options
      switch (type) {
        case 'decaying':
          // Hide ranger
          rangeDiv.style.display = '';
          timeSlider.noUiSlider.updateOptions({
            range: {
              min: 0,
              max: config.halflifeLengths.length - 1
            }
          });
          timeSlider.noUiSlider.set([3]);
          // Update range labels
          rangeTitle.innerHTML = 'Survey Halflife:';
          minLimit.innerHTML = config.halflifeLengths[0].label;
          maxLimit.innerHTML = config.halflifeLengths[config.halflifeLengths.length-1].label;
          break;
        case 'none':
          // Hide ranger
          rangeDiv.style.display = 'none';
          break;
      }

      callListeners();
    } else {
      selectedTimeType = type;
    }
  }
};

/*
  <div id="range">
    <div id="rangeTitle">Range:</div>
    <div class="range key">&nbsp;
      <div class="min" id="lowerValue">dsfd</div>
      <div class="max" id="upperValue">dsfds</div>
    </div>
    <div id="timeSlider"></div>
    <div class="separatedRange">
      <div class="min" id="lowerValue"></div>
      <div class="separator" id="valueSeparator"></div>
      <div class="max" id="upperValue"></div>
    </div>
  </div>
*/

export function createTimeSection(parentElement: HTMLElement) {
  let element, div;
  parentElement.classList.add('time');
  parentElement.appendChild(element = document.createElement('div'));
  Object.keys(timeTypes).forEach((time) => {
    let button = document.createElement('button');
    let timeType = timeTypes[time];
    timeType.button = button;
    element.appendChild(button);
    let span;
    button.appendChild((span = document.createElement('span')));
    span.innerHTML = timeType.label;
    if (timeType.description) {
      button.title = timeType.description;
    }
    if (timeType.id === selectedTimeType) {
      button.classList.add('selected');
    }
    button.addEventListener('click', selectTimeType.bind(null, time));
  });

  parentElement.appendChild(rangeDiv = document.createElement('div'));

  // Range
  rangeDiv.appendChild(rangeTitle = document.createElement('div'));
  rangeTitle.innerHTML = 'Range:';
  rangeDiv.appendChild(div = document.createElement('div'));
  div.classList.add('range', 'key');
  div.appendChild(minLimit = document.createElement('div'));
  minLimit.classList.add('min');
  div.appendChild(maxLimit = document.createElement('div'));
  maxLimit.classList.add('max');

  // Create the time slider
  rangeDiv.appendChild(timeSlider = document.createElement('div'));

    // Limit values
    rangeDiv.appendChild(div = document.createElement('div'));
    div.classList.add('separatedRange');
    div.appendChild(lowerValue = document.createElement('div'));
    lowerValue.classList.add('min');
    div.appendChild(limitSeparator = document.createElement('div'));
    limitSeparator.classList.add('separator');
    div.appendChild(upperValue = document.createElement('div'));
    upperValue.classList.add('max');

  noUiSlider.create(timeSlider, {
    start: [0],
    step: 1,
    range: {
      min: 0,
      max: config.halflifeLengths.length - 1
    }
  });

  /**
   * Handles an update to the slider value(s) by change the value text(s)
   *
   * @returns {undefined}
   */
  let sliderUpdate = () => {
    // Update value
    switch (selectedTimeType) {
      case 'decaying':
        lowerValue.innerText = config.halflifeLengths[Math.round(timeSlider.noUiSlider.get())].label;
        break;
    }
  };

  timeSlider.noUiSlider.on('update', sliderUpdate);
  timeSlider.noUiSlider.on('change', callListeners);

  // Default to decaying
  selectTimeType(config.defaultTime);
};
export default createTimeSection;
