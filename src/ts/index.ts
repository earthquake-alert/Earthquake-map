import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVTFormat from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

import 'ol/ol.css';
import { VectorTile } from 'ol';

const prefMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/pref/{z}/{x}/{y}.pbf',
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 3000,
});

const distlictMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat({}),
    url: 'static/distlict/{z}/{x}/{y}.pbf',
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 3000,
});

const worldMao = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/world/{z}/{x}/{y}.pbf',
  }),
  maxZoom: 5,
  minZoom: 0,
  minResolution: 3000,
})

const map = new Map({
  target: 'map',
  view: new View({
    center: fromLonLat([140.46, 36.37]),
    zoom: 6,
  }),
  layers: [
    prefMap,
    distlictMap,
    worldMao
  ],
});
