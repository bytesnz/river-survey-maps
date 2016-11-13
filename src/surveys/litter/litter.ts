import { scores } from '../ratings';
import Buttons from '../../lib/filterButtons';

const filterValues: Button[] = [
  {
    label: '0-9',
    color: [36, 97, 62]
  },
  {
    label: '10-29',
    value: 10,
    color: [33, 93, 54]
  },
  {
    label: '30-49',
    value: 30,
    color: [14, 88, 55]
  },
  {
    label: '50-100',
    value: 50,
    color: [3, 85, 57]
  },
  {
    label: '100+',
    color: [354, 73, 43]
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'ceiling',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

export function selected(value?: number) {
  if (value === undefined) {
    return buttons.selected();
  }
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

export function getColor(value: number) {
  if (value === null) {
    return;
  }
  return buttons.getColor(value);
}

export function score(value: number) {
  if (typeof value === 'number') {
    if (value === 0) {
      return scores['excellent'];
    } else if (value < 30) {
      return scores['moderate'];
    } else if (value < 100) {
      return scores['poor'];
    } else {
      return scores['bad'];
    }
  }
}
