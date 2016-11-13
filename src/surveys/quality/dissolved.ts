import { scores } from "../ratings";
import Buttons from '../../lib/filterButtons';

export let label = 'Dissolved Oxygen';

export let description = `Volunteers measure the amount of dissolved oxygen
(DO) in the water which tells us how much oxygen there is available for river
life to use (e.g. fish and insects). Dissolved oxygen is measured in ‘parts
per million’ (ppm); high levels (above 10ppm) indicate a healthy river. When
untreated sewage is discharged into the Thames, microorganisms use the
dissolved oxygen to break down the sewage meaning that oxygen is no longer
available for other forms of life. This can lead to large scale fish kills
such as those in 2004 and 2011, when thousands of fish died after sewage
entered the river.`;

const filterValues: Button[] = [
  {
    value: 0,
    color: [354, 73, 43]
  },
  {
    value: 1,
    color: [3, 85, 57]
  },
  {
    value: 2,
    color: [14, 88, 55]
  },
  {
    value: 4,
    color: [36, 97, 62]
  },
  {
    value: 6,
    color: [63, 75, 50]
  },
  {
    value: 8,
    color: [128, 52, 47]
  },
  {
    value: 10,
    color: [152, 91, 21]
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'round',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

let getValue = (survey: Survey) => survey.attributes.thames21DissolvedOxygen;

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
  let value = survey.attributes.thames21DissolvedOxygen;
  if (typeof value === 'number') {
    if (value >= 8) {
      return scores['excellent'];
    } else if (value >= 6) {
      return scores['good'];
    } else if (value >= 4) {
      return scores['moderate'];
    } else if (value >= 2) {
      return scores['poor'];
    } else if (value >= 0) {
      return scores['bad'];
    }
  }
}
