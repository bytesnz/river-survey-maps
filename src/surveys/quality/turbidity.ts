import { scores } from "../ratings";
import Buttons from '../../lib/filterButtons';

export let label = 'Turbidity';

export let description = `Volunteers record how much algae, soil particles
and other tiny substances are carried in the water. This is called turbidity
and it is a measure of how far light can travel through the water. Turbidity
reduces the light available to plants for photosynthesis and can increase
water temperature (as particles absorb more heat). The particles can also
affect fish directly by clogging their gills. On the tidal Thames we would
expect it to be muddy and turbid but it is important to measure because of
its possible impacts when conditions are particularly poor.`

const filterValues: Button[] = [
  {
    label: '<12',
    color: [196, 100, 47]
  },
  {
    value: 12,
    color: [191, 100, 41]
  },
  {
    value: 13,
    color: [187, 75, 42]
  },
  {
    value: 14,
    color: [177, 27, 52]
  },
  {
    value: 15,
    color: [125, 13, 59]
  },
  {
    value: 17,
    color: [51, 23, 56]
  },
  {
    value: 19,
    color: [38, 48, 57]
  },
  {
    value: 21,
    color: [34, 71, 56]
  },
  {
    value: 25,
    color: [33, 93, 54]
  },
  {
    value: 30,
    color: [32, 78, 51]
  },
  {
    value: 40,
    color: [31, 68, 48]
  },
  {
    value: 50,
    color: [30, 65, 45]
  },
  {
    value: 75,
    color: [30, 61, 43]
  },
  {
    value: 100,
    color: [29, 57, 40]
  },
  {
    value: 150,
    color: [29, 55, 36]
  },
  {
    value: 200,
    color: [28, 51, 34]
  },
  {
    value: 240,
    color: [28, 49, 31]
  }
];

const buttons = Buttons(filterValues, <FilterButtonOptions>{
  numeric: true,
  rounding: 'floor',
  operationButtons: true,
  noneIsSelected: true,
  //enableColor: true
});

let getValue = (survey: Survey) => survey.attributes.thames21Turbidity;

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
    if (value < 20) {
      return scores['excellent'];
    } else if (value < 75) {
      return scores['good'];
    } else {
      return scores['moderate'];
    }
  }
}
