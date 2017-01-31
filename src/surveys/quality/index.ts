
import * as Coliforms from './coliforms';
import * as O2 from './dissolved';
import * as Ph from './ph';
import * as Temperature from './temperature';
import * as Turbidity from './turbidity';

export let label = 'Water Quality';

export let layerId = 'thames21ThamesWaterQuality';

export let url = 'https://widget.cartographer.io/api/v1/map';

export let getParams = {
  subdomain: 'thames21',
  layer: 'thames21ThamesWaterQuality'
};

export let parts = {
  coliforms: Coliforms,
  o2: O2,
  ph: Ph,
  temperature: Temperature,
  turbidity: Turbidity
};
