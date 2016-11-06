import * as Map from '../lib/map';
import * as Quality from './quality';
import * as Ratings from './ratings';
import * as Surveys from './surveys';
import * as Time from '../lib/time';
import * as Controls from '../lib/controls';
import L = require('leaflet');
import config from '../config';

let timeTypes = {
  none: {
    label: 'No limit',
  },
  decaying: {
    label: 'Decaying',
    description: 'The older the survey, the more opaque it is'
  },
  ranged: {
    label: 'Ranged'
  }
};


export function create(element: HTMLElement) {
  // Add sections
  let surveySection = Controls.addControlSection('Thames21 Surveys', element);
  let surveyButtonsSection = Controls.addControlSection('Surveys', surveySection);
  let ratingsSection = Controls.addControlSection('Overall Rating', surveySection);


  // Create survey selection buttons
  Surveys.createSurveyButtons(surveyButtonsSection);

  Ratings.createRatings(ratingsSection);

  if (config.startSurveysEnabled) {
    Surveys.toggleSurvey();
    Surveys.reloadData();
  }
};
export default create;
