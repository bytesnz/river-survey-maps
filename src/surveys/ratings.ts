import config from '../config';
import Buttons from '../lib/filterButtons';

interface Rating {
  label: string,
  id: string,
  color: HSLColor
};

export let ratings: Rating[] = [
  {
    label: 'Excellent',
    id: 'excellent',
    color: [114, 63, 54]
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

const buttons = Buttons(ratings, {
  operationButtons: true,
  noneIsSelected: true
}, undefined, config.startRatingsEnabled);

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

export const { selected, select, createButtons, addListener, removeListener, color } = buttons;

export function createRatings(parentElement: HTMLElement) {
  let element: HTMLElement;
  parentElement.appendChild((element = document.createElement('div')));
  parentElement.classList.add('ratings');
  // Add ratings buttons to ratings section div
  buttons.createButtons(element);
};
export default createRatings;
