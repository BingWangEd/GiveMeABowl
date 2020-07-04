const AREAS = require("./enums");

const AREAS_GEO_COORDS = {
  [AREAS.ROPPONGI_ITCHOME]: {
    lat: '35.6654626',
    long: '139.7368024',
  },
  [AREAS.ROPPONGI]: {
    lat: '35.6627',
    long: '139.7312',
  },
  [AREAS.EBISU]: {
    lat: '35.6467',
    long: '139.7101',
  },
  [AREAS.SHIBUYA]: {
    lat: '35.6580',
    long: '139.7016',
  },
  [AREAS.OMOTESANDO]: {
    lat: '35.6653',
    long: '139.7121',
  },
  [AREAS.SHINJUKU]: {
    lat: '35.6896',
    long: '139.7006',
  },
  [AREAS.TOKYO_STATION]: {
    lat: '35.6812',
    long: '139.7671',
  },
}

module.exports = AREAS_GEO_COORDS;
