/*!
 * @author: Yuto Watanabe
 * @version: 1.0.0
 *
 * Copyright (c) 2020 Earthquake alert
 */

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';

import * as control from 'ol/control';
import * as Format from 'ol/format';
import * as Layer from 'ol/layer';
import { fromLonLat, transformExtent } from 'ol/proj';
import * as Source from 'ol/source';


import {Style, Stroke, Fill} from 'ol/style';

import {color} from './color';
import {
  setUrl,
  tileStyle,
  center,
  zoomLevel,
  pointGeoJSON,
  pointStyle,
  isOverseas,
  tsunamiStyle,
  // isTileColor,
} from './mapStyle';

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
      'Copyright(c) 2020 Earthquake alert / 地図データ: 国土数値情報(湖沼データ), 気象庁(地震情報/細分区域, 緊急地震速報/府県予報区)',
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

// 津波予報区魔府
const tsunamiAreaMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT(),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/tsunami/{z}/{x}/{y}.pbf',
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  style: tsunamiStyle,
  maxZoom: 10,
  minZoom: 0,
  maxResolution: 5000,
});

// 細分区域のマップ
const districtMap = new Layer.VectorTile({
  source: new Source.VectorTile({
    format: new Format.MVT({}),
    url: 'https://earthquake-alert.github.io/maps/pbf_japan/distlict_jma/{z}/{x}/{y}.pbf',
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      'Copyright(c) 2020 Earthquake alert / 地図データ: Natural Earth',
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
});

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
      color: color('minimapStroke'),
      width: 0.5,
    }),
  }),
  maxZoom: 10,
  minZoom: 0,
});

// 震度観測点のマップ
const pointMap = new Layer.Vector({
  source: new Source.Vector({
    features: pointGeoJSON(),
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  style: pointStyle,
  maxZoom: 10,
  minZoom: 0,
});

// ミニマップ設定
const overviewMapControl = new control.OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    overviewMap,
  ],
  collapsed: false,
  view: new View({
    extent: transformExtent([126.914062,26.588527,149.414062,45.213003], 'EPSG:4326', 'EPSG:3857'),
    minZoom: 0,
    maxZoom: 4,
    zoom: 4,
  })
});

const mapControl = [attribution];

// 海外の場合はミニマップを表示しない
if (!isOverseas){
  mapControl.push(overviewMapControl);
}

// マップ描画
const map = new Map({
  controls: control.defaults().extend(mapControl),
  target: 'map',
  view: new View({
    center: fromLonLat(center()),
    zoom: zoomLevel(),
    maxZoom: 10,
  }),
  layers: [
    worldMap,
    districtMap,
    waterAreaMap,
    prefMap,
    tsunamiAreaMap,
    pointMap,
  ],
});

// タイル塗りつぶし、海外自地震以外は自動的に拡大率を決める
// if(!(isOverseas || isTileColor)){
//   console.log("OK");
//   const markerSource = new Source.Vector({
//       features: pointGeoJSON(),
//     });

//   map.getView().fit(markerSource.getExtent());
// }
