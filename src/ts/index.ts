import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVTFormat from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';
import {Style, Stroke, Fill} from 'ol/style';
import {OverviewMap, Attribution, defaults as defaultControls} from 'ol/control';
import 'ol/ol.css';

import {setUrl, tileStyle, center, zoomLevel} from './mapStyle'

const url = location.href;
setUrl(url);

// 地図データ
const attribution = new Attribution({
  className: 'copyright',
  collapsible: false,
});

// 都道府県のマップ
const prefMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/pref_jma/{z}/{x}/{y}.pbf',
    attributions: [
      '© Earthquake alert(YutoWatanabe) / 地図データ: 国土数値情報(湖沼データ), 気象庁(地震情報／細分区域, 緊急地震速報／府県予報区)',
    ],
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
    url: 'https://earthquake-alert.github.io/maps/pbf_water_area/waterArea/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: '#5c6d8a'
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
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/distlict_jma/{z}/{x}/{y}.pbf',
  }),
  // @ts-ignore
  style: tileStyle,
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});


// 世界のマップ
const worldMap = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVTFormat(),
    url: 'https://earthquake-alert.github.io/maps/pbf_world/world/{z}/{x}/{y}.pbf',
    attributions: [
      '© Earthquake alert(YutoWatanabe) / 地図データ: Natural Earth',
    ],
  }),
  style: new Style({
    fill: new Fill({
      color: '#474747',
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
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/pref_jma/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: '#474747',
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
  controls: defaultControls().extend([
    overviewMapControl,
    attribution,
  ]),
  target: 'map',
  view: new View({
    center: fromLonLat(center()),
    zoom: zoomLevel(),
    maxZoom: 10,
  }),
  layers: [
    worldMap,
    distlictMap,
    waterAreaMap,
    prefMap,
  ],
});
