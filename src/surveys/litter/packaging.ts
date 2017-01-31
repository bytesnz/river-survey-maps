import { scores } from '../ratings';
import * as Litter from './litter';

export let label = 'Packaging';

export let description = `Non-food related packaging is a separate category that includes plastic shopping bags, refuse sacks, and bottles/containers not used for food (e.g. cosmetics, pharmaceutical).`;

let getValue = (survey: Survey) => survey ? survey.attributes.thames21LitterPackaging : undefined;

export const selected = survey => Litter.selected(getValue(survey));
export const getColor = survey => Litter.getColor(getValue(survey));
export const score = survey => Litter.score(getValue(survey));

export const {createButtons, select, addListener, color } = Litter;
