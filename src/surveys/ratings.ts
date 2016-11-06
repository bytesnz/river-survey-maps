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
    color: [14, 88, 55]
  },
  {
    label: 'Bad',
    id: 'bad',
    color: [358, 80, 51]
  }
];

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

export function selectRatings(rating?: string | boolean, method?: number) {
  if (typeof rating === 'string') {
    if (typeof scores[rating] !== 'undefined') {
      switch (method) {
        case EXCLUSIVE:
          selectedRatings = [rating];
          break;
        case LESS_THAN:
          selectedRatings = [];
          for (let i = scores[rating]; i >= 0; i--) {
            selectedRatings.push(ratings[i].id);
          }
          break;
        case GREATER_THAN:
          selectedRatings = [];
          for (let i = scores[rating]; i < ratings.length; i++) {
            selectedRatings.push(ratings[i].id);
          }
          break;
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
};

export function createRatings(element: HTMLElement) {
  // Add ratings buttons to ratings section div
  ratings.forEach((rating) => {
    let button = document.createElement('div');
    let div;
    element.appendChild(button);
    button.classList.add('button');
    button.innerHTML = rating.label;

    // Add the exclusing and less than buttons
    button.appendChild((div = document.createElement('div')));
    div.innerHTML = '&oplus;';
    div.addEventListener('click', selectRatings.bind(null, rating.id, EXCLUSIVE));

    button.appendChild((div = document.createElement('div')));
    div.innerHTML = '&lt;';
    div.addEventListener('click', selectRatings.bind(null, rating.id, LESS_THAN));

    button.addEventListener('click', selectRatings.bind(null, rating.id));

    if (config.startRatingsEnabled) {
      button.classList.add('selected');
      selectedRatings.push(rating.id);
    }
  });
};
export default createRatings;
