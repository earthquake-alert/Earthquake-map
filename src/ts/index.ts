import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';

import * as Layer from 'ol/layer';
import * as Source from 'ol/source';
import * as control from 'ol/control';
import * as Format from 'ol/format';
import * as Geom from 'ol/geom';


import {Style, Stroke, Fill, Icon} from 'ol/style';
import { fromLonLat } from 'ol/proj';

import {setUrl, tileStyle, center, zoomLevel, pointEpicenter} from './mapStyle';
import {color} from './color';

const url = location.href;
setUrl(url);

// 地図データ
const attribution = new control.Attribution({
  className: 'copyright',
  collapsible: false,
});

// 都道府県のマップ
const prefMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT(),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/pref_jma/{z}/{x}/{y}.pbf',
    attributions: [
      '© Earthquake alert(YutoWatanabe) / 地図データ: 国土数値情報(湖沼データ), 気象庁(地震情報／細分区域, 緊急地震速報／府県予報区)',
    ],
  }),
  style: new Style({
    stroke: new Stroke({
      color: color('prefCountryStroke'),
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});

// 水域マップ
const waterAreaMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT(),
    url: 'https://earthquake-alert.github.io/maps/pbf_water_area/waterArea/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: color('waterArea'),
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});

// 細分区域のマップ
const distlictMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT({}),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/distlict_jma/{z}/{x}/{y}.pbf',
  }),
  // @ts-ignore
  style: tileStyle,
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});


// 世界のマップ
const worldMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT(),
    url: 'https://earthquake-alert.github.io/maps/pbf_world/world/{z}/{x}/{y}.pbf',
    attributions: [
      '© Earthquake alert(YutoWatanabe) / 地図データ: Natural Earth',
    ],
  }),
  style: new Style({
    fill: new Fill({
      color: color('land'),
    }),
    stroke: new Stroke({
      color: color('prefCountryStroke'),
    }),
  }),
  maxZoom: 5,
  minZoom: 0,
  minResolution: 5000,
})

// ミニマップ用日本のマップ（都道府県と同じ）
const overviewMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT(),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/pref_jma/{z}/{x}/{y}.pbf',
  }),
  style: new Style({
    fill: new Fill({
      color: color('minimapLand'),
    }),
    stroke: new Stroke({
      color: color('prefCountryStroke'),
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
});

// 震源地
const epicenterMap = new Layer.Vector({
  source: new Source.Vector({
    features: [
      new Feature({
        geometry: new Geom.Point(fromLonLat(pointEpicenter())),
      }),
    ],
  }),
  style: new Style({
    image: new Icon( /** @type {olx.style.IconOptions} */{
      scale: 0.5,
      src: 'static/icon/epi.png',
    }),
  })
});

// ミニマップ設定
const overviewMapControl = new control.OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    overviewMap,
  ],
  collapsed: false,
})

// マップ描画
const map = new Map({
  controls: control.defaults().extend([
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
    epicenterMap,
  ],
});
