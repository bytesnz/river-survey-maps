import config from '../config';

interface Rating {
  label: string,
  id: string,
  color: HSLColor
};

export let ratings: Rating[] = [
  {
    label: 'Excellent',
    id: 'excellent',
    color: [114, 63,54]
  },
  {
    label: 'Good',
    id: 'good',
    color: [74, 51, 54]
  },
  {
    label: 'Moderate',
    id: 'moderate',
    color: [52, 94, 50]
  },
  {
    label: 'Poor',
    id: 'poor',
    color: [33, 88, 55]
  },
  {
    label: 'Bad',
    id: 'bad',
    color: [358, 80, 51]
  }
];

let buttons = {};

let ratingListeners: Function[] = [];

export let scores = {};

ratings.forEach((rating, i) => {
  scores[rating.id] = i;
});

export let colors: any = {};

ratings.forEach((rating, i) => {
  colors[rating.id] = rating.color;
});

export function getColor(rating: string | number): HSLColor {
  if (typeof rating === 'number') {
    rating = Math.min(Math.max(0, rating), ratings.length);
    return ratings[rating].color;
  } else {
    if (typeof scores[rating] !== 'undefined') {
      return ratings[scores[rating]].color;
    }
  }
}

export let selectedRatings: string[] = [];

export const EXCLUSIVE = 1;
export const LESS_THAN = 2;
export const GREATER_THAN = 3;

/**
 * Get the selected  ratings or test if a certain raiting is selected
 *
 * @param {string|number} [rating] Rating to test if currently selected
 */
export function selected(rating?: string | number): string[] | boolean {
  if (typeof rating === 'number') {
    return (selectedRatings.indexOf(ratings[rating].id) !== -1);
  } else if (typeof rating === 'string'
      && typeof scores[rating] !== 'undefined') {
    return (selectedRatings.indexOf(rating) !== -1);
  }
  return selectedRatings;
}

export function selectRatings(rating?: string | boolean, method?: number, event?: Event) {
  if (event) {
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
  }

  if (typeof rating === 'string') {
    if (typeof scores[rating] !== 'undefined') {
      switch (method) {
        case EXCLUSIVE:
          selectedRatings = [rating];
          ratings.forEach((ratingData, score) => {
            if (ratingData.id === rating) {
              buttons[ratingData.id].classList.add('selected');
            } else {
              buttons[ratingData.id].classList.remove('selected');
            }
          });
          break;
        case LESS_THAN:
          selectedRatings = [];
          ratings.forEach((ratingData, score) => {
            if (score >= scores[rating]) {
              selectedRatings.push(ratingData.id);
              buttons[ratingData.id].classList.add('selected');
            } else {
              buttons[ratingData.id].classList.remove('selected');
            }
          });
          break;
        case GREATER_THAN:
          selectedRatings = [];
          ratings.forEach((ratingData, score) => {
            if (score <= scores[rating]) {
              selectedRatings.push(ratingData.id);
              buttons[ratingData.id].classList.add('selected');
            } else {
              buttons[ratingData.id].classList.remove('selected');
            }
          });
          break;
        default:
          let i;
          if ((i = selectedRatings.indexOf(rating)) !== -1) {
            selectedRatings.splice(i, 1);
            buttons[rating].classList.remove('selected');
            //buttons['all'].classList.remove('selected');
          } else {
            selectedRatings.push(rating);
            buttons[rating].classList.add('selected');
            /*if (selectRatings.length === ratings.length) {
              buttons['all'].classList.add('selected');
            }*/
          }
      }
    }
  } else {
    if ((typeof rating === 'boolean' && rating === false)
        || selectedRatings.length === ratings.length) {
      selectedRatings = [];
    } else {
      selectedRatings = ratings.map(rating => rating.id);
    }
  }

  ratingListeners.forEach((callback) => {
    callback();
  });
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
  if ((id = ratingListeners.indexOf(func)) !== -1) {
    return id;
  }

  return ratingListeners.push(func) - 1;
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
  if (typeof item === 'number' && typeof ratingListeners[item] !== 'undefined') {
    delete ratingListeners[item];
  } else if (typeof item === 'function'
      && (id = ratingListeners.indexOf(item)) !== -1) {
    delete ratingListeners[id];
  }
};

export function createRatings(parentElement: HTMLElement) {
  let element: HTMLElement;
  parentElement.appendChild((element = document.createElement('div')));
  parentElement.classList.add('ratings');
  // Add ratings buttons to ratings section div
  ratings.forEach((rating) => {
    let button = document.createElement('div');
    let div;
    element.appendChild(button);
    button.classList.add('button', rating.id);
    button.innerHTML = rating.label;
    buttons[rating.id] = button;

    // Add the exclusing and less than buttons
    button.appendChild((div = document.createElement('div')));
    div.innerHTML = '&oplus;';
    div.addEventListener('click', selectRatings.bind(null, rating.id, EXCLUSIVE));

    button.appendChild((div = document.createElement('div')));
    div.innerHTML = '&lt;';
    div.addEventListener('click', selectRatings.bind(null, rating.id, LESS_THAN));

    button.addEventListener('click', selectRatings.bind(null, rating.id, false));

    if (config.startRatingsEnabled) {
      button.classList.add('selected');
      selectedRatings.push(rating.id);
    }
  });
};
export default createRatings;
