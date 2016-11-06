import { scores } from "../ratings";

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

export function color(survey) {
  let value = survey.attributes.thames21DissolvedOxygen;
  if (typeof value === 'number') {
    if (value >= 10) {
      return [152, 91, 21];
    } else if (value >= 8) {
      return [128, 52, 47];
    } else if (value >= 6) {
      return [63, 75, 50];
    } else if (value >= 4) {
      return [36, 97, 62];
    } else if (value >= 2) {
      return [14, 88, 55];
    } else if (value >= 1) {
      return [3, 85, 57];
    } else if (value >= 0) {
      return [354, 73, 43];
    }
  }
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
