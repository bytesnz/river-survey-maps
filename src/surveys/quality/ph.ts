import { scores } from '../ratings';
import Buttons from '../../lib/filterButtons';

export let label = 'pH';

export let description = `For the Thames to support a variety of wildlife, the water mustn’t be too acid or alkali. In the past, the pH of the Thames would have been affected by pollution from industry, killing all wildlife. These days, we would expect the water to be neutral (neither acid nor alkali) which is better for wildlife. Volunteers measure the pH of the water to find this out.`;

const filterValues: Button[] = [
  {
    color: [358, 80, 35]
  },
  {
    color: [358, 80, 51]
  },
  {
    color: [26, 85, 53]
  },
  {
    color: [35, 90, 54]
  },
  {
    color: [45, 91, 52]
  },
  {
    color: [52, 94, 50]
  },
  {
    color: [58, 90, 51]
  },
  {
    color: [65, 68, 51]
  },
  {
    color: [74, 51, 54]
  },
  {
    color: [170, 22, 57]
  },
  {
    color: [202, 54, 50]
  },
  {
    color: [211, 52, 51]
  },
  {
    color: [217, 48, 48]
  },
  {
    color: [251, 34, 47]
  },
  {
    color: [264, 40, 43]
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'round',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

let getValue = (survey: Survey) => survey.attributes.thames21Ph;

export function selected(survey?: Survey) {
  if (survey === undefined) {
    return buttons.selected();
  }
  let value = getValue(survey);
  let selected = <string[]>buttons.selected();
  if (value === null) {
    if (selected.length === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return buttons.selected(Math.round(value));
  }
}

export const {createButtons, select, addListener, color } = buttons;

export function getColor(survey) {
  let value = getValue(survey);
  if (value === null) {
    return;
  }
  return buttons.getColor(value);
}

export function score(survey) {
  let value = getValue(survey);
  if (typeof value === 'number') {
    switch (Math.round(value)) {
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
        return scores['bad'];
      case 6:
      case 9:
        return scores['good'];
      case 7:
      case 8:
        return scores['excellent'];
    }
  }
}
