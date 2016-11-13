import { scores } from '../ratings';
import * as Litter from './litter';

export let label = 'Unidentified Plastic';

export let description = `During our foreshore clean-ups on the Thames, we consistently find fragments of plastic that has already begun to degrade and so cannot be identified. Such plastic fragments are frequently ingested by wildlife and present a significant threat to their health.`;

let getValue = (survey: Survey) => survey ? survey.attributes.thames21LitterUnidentifiedPlastic : undefined;

export const selected = survey => Litter.selected(getValue(survey));
export const getColor = survey => Litter.getColor(getValue(survey));
export const score = survey => Litter.score(getValue(survey));

export const {createButtons, select, addListener, color } = Litter;
