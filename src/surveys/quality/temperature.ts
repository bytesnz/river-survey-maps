import { scores } from "../ratings";
import Buttons from '../../lib/filterButtons';

export let label = 'Temperature';

export let description = `High water temperatures can have a negative impact
on river life – both directly and by reducing the amount of dissolved oxygen
that the water can hold. Unnatural warming of the water is called 'thermal
pollution'. In the past, this would have been discharged directly from an
industrial source (such as power stations like Battersea).  These days, a
possible source is rainwater run-off, which is heated up as it moves across
the warmer roads and ends up in the river.`;

const filterValues: Button[] = [
  {
    label: '<3',
    value: 0,
    color: [238, 52, 38]
  },
  {
    value: 3,
    color: [214, 86, 34]
  },
  {
    value: 6,
    color: [206, 100, 35]
  },
  {
    value: 9,
    color: [202, 100, 39]
  },
  {
    value: 12,
    color: [199, 100, 43]
  },
  {
    value: 15,
    color: [196, 100, 47]
  },
  {
    value: 18,
    color: [188, 95, 39]
  },
  {
    value: 21,
    color: [173, 24, 54]
  },
  {
    value: 24,
    color: [27, 83, 53]
  },
  {
    value: 29,
    color: [354, 73, 43]
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'floor',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

let getValue = (survey: Survey) => survey.attributes.thames21Temperature;

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
    if (value < 21) {
      return scores['excellent'];
    } else if (value < 24) {
      return scores['good'];
    } else if (value < 29) {
      return scores['moderate'];
    } else { // 29+
      return scores['bad'];
    }
  }
}
