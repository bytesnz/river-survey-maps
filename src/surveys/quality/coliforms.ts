import { scores, colors } from "../ratings";
import Buttons from '../../lib/filterButtons';

export let label = 'Coliforms';

export let description = `Volunteers carry out one-off tests to indicate the presence of coliform bacteria which are found in the intestinal tract of animals and humans. Although harmless themselves, they can indicate presence of pathogens and viruses. These enter the water when there is sewage or animal waste discharged into the Thames.`;

const filterValues: Button[] = [
  {
    label: 'Not Present',
    id: 'notpresent',
    value: false,
    color: colors['good']
  },
  {
    label: 'Present',
    id: 'present',
    value: true,
    color: colors['bad']
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'round',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

let getValue = (survey: Survey) => survey.attributes.thames21Coliforms;

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
  let value = survey.attributes.thames21Coliforms;
  if (value === true) {
    return scores['good'];
  } else if (value === false) {
    return scores['bad'];
  }
}
