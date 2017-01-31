const hour = 60*60*1000,
    day = hour * 24,
    week = day * 7,
    month = day * 30,
    year = day * 365;

const config = {
  halflifeLengths: [
    { label: "1 week", time: week},
    { label: "2 weeks", time: 2 * week},
    { label: "3 weeks", time: 3 * week},
    { label: "1 month", time: month},
    { label: "2 months", time: 2 * month},
    { label: "3 months", time: 3 * month},
    { label: "6 months", time: 6 * month},
    { label: "1 year", time: year},
    { label: "2 years", time: 2 * year},
  ],
  defaultMarkerOptions: {
    color: "#ffffff",
    interactive: true,
    weight: 2
  },
  startRatingsEnabled: true,
  startFiltersEnabled: true,
  expiredSaturation: 0,
  decaySaturation: false,
  expiredLightness: 60,
  decayLightness: false,
  decayOpacity: true,
  startSurveysEnabled: false,
  defaultTime: "decaying",
  mapMoveTimeout: 1000,
  defaultSurveys: {
    quality: {
      ph: true
    }
  }
}

export default config;
