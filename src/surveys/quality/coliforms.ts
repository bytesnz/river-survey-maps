import { scores, colors } from "../ratings";

export let label = 'Coliforms';

export let description = `Volunteers carry out one-off tests to indicate the
presence of coliform bacteria which are found in the intestinal tract of
animals and humans. Although harmless themselves, they can indicate presence
of pathogens and viruses. These enter the water when there is sewage or
animal waste discharged into the Thames.`;

export function color(survey) {
  let value = survey.attributes.thames21Coliforms;
  if (value === true) {
    return colors['good'];
  } else if (value === false) {
    return colors['bad'];
  }
}

export function score(survey) {
  let value = survey.attributes.thames21Coliforms;
  if (value === true) {
    return scores['good'];
  } else if (value === false) {
    return scores['bad'];
  }
}
