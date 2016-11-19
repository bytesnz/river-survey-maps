"use strict";
var config = {
    halflifeLengths: [
        { label: "1 hour", time: 3600000 },
        { label: "1 day", time: 86400000 },
        { label: "1 week", time: 604800000 },
        { label: "1 month", time: 2592000000 },
        { label: "1 year", time: 31536000000 }
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
};
exports.__esModule = true;
exports["default"] = config;
