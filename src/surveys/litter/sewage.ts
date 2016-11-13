import { scores } from '../ratings';
import * as Litter from './litter';

export let label = 'Sewage Related';

export let description = `This category refers to any litter that is expected to have been discarded down a toilet. This includes baby wipes, sanitary towels, cotton-bud sticks, nappies and syringes.`;

let getValue = (survey: Survey) => survey ? survey.attributes.thames21LitterSewageRelated : undefined;

export const selected = survey => Litter.selected(getValue(survey));
export const getColor = survey => Litter.getColor(getValue(survey));
export const score = survey => Litter.score(getValue(survey));

export const {createButtons, select, addListener, color } = Litter;
