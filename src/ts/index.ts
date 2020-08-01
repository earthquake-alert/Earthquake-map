import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVTFormat from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';
import {Style, Stroke, Fill} from 'ol/style';
import {OverviewMap, defaults as defaultControls} from 'ol/control';


import vtStyle from './mapStyle'

import 'ol/ol.css';

// 都道府県のマップ
const prefMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/pref/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    stroke: new Stroke({
      color: '#a6a6a6'
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});

// 水域マップ
const waterAreaMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/waterArea/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: '#3b446e'
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});

// 細分区域のマップ
const distlictMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat({}),
    url: 'static/distlict/{z}/{x}/{y}.pbf',
  }),
  // @ts-ignore
  style: vtStyle,
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});


// 世界のマップ
const worldMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/world/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: '#595959',
    }),
    stroke: new Stroke({
      color: '#a6a6a6'
    }),
  }),
  maxZoom: 5,
  minZoom: 0,
  minResolution: 5000,
})

// ミニマップ用日本のマップ（都道府県と同じ）
const overviewMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'static/pref/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: '#595959',
    }),
    stroke: new Stroke({
      color: '#a6a6a6'
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
});

// ミニマップ設定
const overviewMapControl = new OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    overviewMap,
  ],
  collapsed: false,
})

// マップ描画
const map = new Map({
  controls: defaultControls().extend([overviewMapControl]),
  target: 'map',
  view: new View({
    center: fromLonLat([140.46, 36.37]),
    zoom: 6,
    maxZoom: 10,
  }),
  layers: [
    worldMap,
    distlictMap,
    prefMap,
    waterAreaMap,
  ],
});
