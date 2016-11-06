import { scores } from "../ratings";

export let label = 'Turbidity';

export let description = `Volunteers record how much algae, soil particles
and other tiny substances are carried in the water. This is called turbidity
and it is a measure of how far light can travel through the water. Turbidity
reduces the light available to plants for photosynthesis and can increase
water temperature (as particles absorb more heat). The particles can also
affect fish directly by clogging their gills. On the tidal Thames we would
expect it to be muddy and turbid but it is important to measure because of
its possible impacts when conditions are particularly poor.`

export function color(survey) {
  let value = survey.attributes.thames21Turbidity;
  if (typeof value === 'number') {
    if (value < 12) {
      return [196, 100, 47];
    } else if (value < 13) {
      return [191, 100, 41];
    } else if (value < 14) {
      return [187, 75, 42];
    } else if (value < 15) {
      return [177, 27, 52];
    } else if (value < 17) {
      return [125, 13, 59];
    } else if (value < 19) {
      return [51, 23, 56];
    } else if (value < 21) {
      return [38, 48, 57];
    } else if (value < 25) {
      return [34, 71, 56];
    } else if (value < 30) {
      return [33, 93, 54];
    } else if (value < 40) {
      return [32, 78, 51];
    } else if (value < 50) {
      return [31, 68, 48];
    } else if (value < 75) {
      return [30, 65, 45];
    } else if (value < 100) {
      return [30, 61, 43];
    } else if (value < 150) {
      return [29, 57, 40];
    } else if (value < 200) {
      return [29, 55, 36];
    } else if (value < 240) {
      return [28, 51, 34];
    } else {
      return [28, 49, 31];
    }
  }
}

export function score(survey) {
  let value = survey.attributes.thames21Turbidity;
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
