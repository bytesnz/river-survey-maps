import { scores } from "../ratings";

export let label = 'Temperature';

export let description = `High water temperatures can have a negative impact
on river life – both directly and by reducing the amount of dissolved oxygen
that the water can hold. Unnatural warming of the water is called 'thermal
pollution'. In the past, this would have been discharged directly from an
industrial source (such as power stations like Battersea).  These days, a
possible source is rainwater run-off, which is heated up as it moves across
the warmer roads and ends up in the river.`;

export function color(survey) {
  let value = survey.attributes.thames21Temperature;
  if (typeof value === 'number') {
    if (value < 3) {
      return [238, 52, 38];
    } else if (value < 6) {
      return [214, 86, 34];
    } else if (value < 9) {
      return [206, 100, 35];
    } else if (value < 12) {
      return [202, 100, 39];
    } else if (value < 15) {
      return [199, 100, 43];
    } else if (value < 18) {
      return [196, 100, 47];
    } else if (value < 21) {
      return [188, 95, 39];
    } else if (value < 24) {
      return [173, 24, 54];
    } else if (value < 29) {
      return [27, 83, 53];
    } else { // 29+
      return [354, 73, 43];
    }
  }
}

export function score(survey) {
  let value = survey.attributes.thames21Temperature;
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
