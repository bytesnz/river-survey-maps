import * as Food from './food';
import * as Packaging from './packaging';
import * as Sewage from './sewage';
import * as Plastic from './plastic';
//import * as Other from './other';

export let label = 'Litter Monitoring';

export let layerId = 'thames21Litter';

export let url = 'https://widget.cartographer.io/api/v1/map';

export let getParams = {
  subdomain: 'thames21',
  layer: layerId
};

export let parts = {
  food: Food,
  packaging: Packaging,
  sewage: Sewage,
  plastic: Plastic,
  //other: Other 'Unidentified Polystyrene' // thames21LitterUnidentifiedPolystyrene
};
