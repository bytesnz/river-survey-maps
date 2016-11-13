import { scores } from '../ratings';
import * as Litter from './litter';

export let label = 'Food Related';

export let description = `This category refers to any litter that originates from the food industry. It is further categorised by material, including: plastic (e.g. drink bottle, food wrapper); metal (e.g. drink cans, bottle top); polystyrene (e.g. takeaway container, cups); or other (e.g. glass, paper, wood, cork).`;

let getValue = (survey: Survey) => survey ? survey.attributes.thames21LitterFoodRelated : undefined;

export const selected = survey => Litter.selected(getValue(survey));
export const getColor = survey => Litter.getColor(getValue(survey));
export const score = survey => Litter.score(getValue(survey));

export const {createButtons, select, addListener, color } = Litter;
