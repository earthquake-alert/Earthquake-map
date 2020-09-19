/*!
 * @author: Yuto Watanabe
 * @version: 1.0.0
 *
 * Copyright (c) 2020 Earthquake alert
 */

import Feature from 'ol/Feature';
import * as Geom from 'ol/geom';

import { fromLonLat } from 'ol/proj';
import RenderFeature from 'ol/render/Feature';
import {Style, Stroke, Fill, Icon} from 'ol/style';
import {color} from './color';
import {district} from './convertPosition';

interface Parameter {
  areas1: string[],
  areas2: string[],
  areas3: string[],
  areas4: string[],
  areas5l: string[],
  areas5u: string[],
  areas6l: string[],
  areas6u: string[],
  areas7: string[],
  pref: string[],
  epicenter: string[],
  point1: string[],
  point2: string[],
  point3: string[],
  point4: string[],
  point5l: string[],
  point5u: string[],
  point6l: string[],
  point6u: string[],
  point7: string[],
}

const parameter: Parameter  = {
  areas1: [],
  areas2: [],
  areas3: [],
  areas4: [],
  areas5l: [],
  areas5u: [],
  areas6l: [],
  areas6u: [],
  areas7: [],
  pref: [],
  epicenter: [],
  point1: [],
  point2: [],
  point3: [],
  point4: [],
  point5l: [],
  point5u: [],
  point6l: [],
  point6u: [],
  point7: [],
};

let count = 0;
// [lon, lat]
const centerPosition: number[] = [0, 0];
const latMaxMin: number[] = [0, 0];
const lonMaxMin: number[] = [0, 0];

export let isOverseas = false;
export let isTileColor = false;

const features: Feature[] = [];

// urlからパラメータを取得
function getUrl(url: string, name: string): string[]{
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(decodeURI(url));

  if (results != null){
    return results[2].replace(/\+/g, " ").split(',');
  }
  return [];
}

// urlのパラメータから変数を設定
export function setUrl(url: string): void {
  // areas 細分区域タイル塗りつぶし
  parameter.areas1 = getUrl(url, 'areas1');
  parameter.areas2 = getUrl(url, 'areas2');
  parameter.areas3 = getUrl(url, 'areas3');
  parameter.areas4 = getUrl(url, 'areas4');
  parameter.areas5l = getUrl(url, 'areas5l');
  parameter.areas5u = getUrl(url, 'areas5u');
  parameter.areas6l = getUrl(url, 'areas6l');
  parameter.areas6u = getUrl(url, 'areas6u');
  parameter.areas7 = getUrl(url, 'areas7');
  // parameter.pref = getUrl(url, 'pref');

  // 震度観測点
  parameter.point1 = getUrl(url, 'point1');
  parameter.point2 = getUrl(url, 'point2');
  parameter.point3 = getUrl(url, 'point3');
  parameter.point4 = getUrl(url, 'point4');
  parameter.point5l = getUrl(url, 'point5l');
  parameter.point5u = getUrl(url, 'point5u');
  parameter.point6l = getUrl(url, 'point6l');
  parameter.point6u = getUrl(url, 'point6u');
  parameter.point7 = getUrl(url, 'point7');

  // 震源地 [lon, lat] & featuresに追加
  parameter.epicenter = getUrl(url, 'epi');

  if (parameter.epicenter.length != 0){
    addEpicenter(parameter.epicenter);
    const lon = parseFloat(parameter.epicenter[0]);
    const lat = parseFloat(parameter.epicenter[1]);

    features.push(
      new Feature({
        type: 'epi',
        geometry: new Geom.Point(fromLonLat([lat, lon])),
      })
    );
  }

  addPosition(parameter.areas1, 'point1');
  addPosition(parameter.areas2, 'point2');
  addPosition(parameter.areas3, 'point3');
  addPosition(parameter.areas4, 'point4');
  addPosition(parameter.areas5l, 'point5l');
  addPosition(parameter.areas5u, 'point5u');
  addPosition(parameter.areas6l, 'point6l');
  addPosition(parameter.areas6u, 'point6u');
  addPosition(parameter.areas7, 'point7');

  addPoint(parameter.point1);
  addPoint(parameter.point2);
  addPoint(parameter.point3);
  addPoint(parameter.point4);
  addPoint(parameter.point5l);
  addPoint(parameter.point5u);
  addPoint(parameter.point6l);
  addPoint(parameter.point6u);
  addPoint(parameter.point7);

  setGeoJSON();
}

// 中心座標を求める
export function center(): number[] {
  if (centerPosition[0] == 0 && centerPosition[1] == 0){
    return [139.570312, 35.621581];
  }
  return [centerPosition[1] / count, centerPosition[0] / count];
}

// GeoJSONを設定
function setGeoJSON() {
  for(const element of parameter.point1){
    addGeoJSON(element, 'point1');
  }
  for(const element of parameter.point2){
    addGeoJSON(element, 'point2');
  }
  for(const element of parameter.point3){
    addGeoJSON(element, 'point3');
  }
  for(const element of parameter.point4){
    addGeoJSON(element, 'point4');
  }
  for(const element of parameter.point5l){
    addGeoJSON(element, 'point5l');
  }
  for(const element of parameter.point5u){
    addGeoJSON(element, 'point5u');
  }
  for(const element of parameter.point6l){
    addGeoJSON(element, 'point6l');
  }
  for(const element of parameter.point6u){
    addGeoJSON(element, 'point6u');
  }
  for(const element of parameter.point7){
    addGeoJSON(element, 'point7');
  }
}

// GeoJSONに各ポイントを追加
function addGeoJSON(point: string, si: string){
  const dividedPint = point.split(':');
  const lon = parseFloat(dividedPint[0]);
  const lat = parseFloat(dividedPint[1]);

  features.push(
   new Feature({
    type: si,
    geometry: new Geom.Point(fromLonLat([lat, lon])),
   })
  );
}

// 拡大率を求める
export function zoomLevel(): number {
  // 海外の場合
  if (isOverseas){
    return 1;
  }
  if ((latMaxMin[0]+latMaxMin[1]) == 0 && (lonMaxMin[0]+lonMaxMin[1]) == 0){
    return 6;
  }
  else{
    // 3平方の定理を用いて対角線長を求める。
    const distance = Math.sqrt(Math.pow((latMaxMin[0]-latMaxMin[1]), 2) + Math.pow((lonMaxMin[0]-lonMaxMin[1]), 2));

    if(distance < 1){
      return isTileColor? 9 : 10;
    }
    if(distance >= 1 && distance < 2){
      return isTileColor? 8 : 9;
    }
    if(distance >= 2 && distance < 3){
      return isTileColor? 8 : 9;
    }
    if(distance >= 3 && distance < 4){
      return isTileColor? 8 : 9;
    }
    if(distance >= 4 && distance < 5){
      return isTileColor? 7 : 9;
    }
    if(distance >= 5 && distance < 6){
      return isTileColor? 7 : 8;
    }
    if(distance >= 6 && distance < 7){
      return isTileColor? 7 : 8;
    }
    if(distance >= 7 && distance < 8){
      return isTileColor? 7 : 8;
    }
    if(distance >= 8 && distance < 9){
      return isTileColor? 7 : 8;
    }
    if(distance >= 9 && distance < 10){
      return isTileColor? 7 : 8;
    }
    if(distance >= 10){
      return isTileColor ? 7 : 7;
    }
    return 6;
  }
}

// 震度観測点、震源を返す
export function pointGeoJSON(): Feature[] {
  return features;
}

// エリアタイル（細分区域）
function addPosition(codes: string[], si: string){
  for(const code of codes){
    isTileColor = true;
    const metaData = district(code);
    positionCalculate(metaData);

    addGeoJSON(`${metaData[0]}:${metaData[1]}`, si);
  }
}

// 震源地
function addEpicenter(position: string[]) {
  const lon = parseFloat(position[0]);
  const lat = parseFloat(position[1]);

  // 海外の地震の場合
  if(lon < 20.2531 || lon > 45.3326 || lat < 122.5557 || lat > 153.5912){
    isOverseas = true;
  }
  positionCalculate([lon, lat]);
}

// 震度観測点
function addPoint(position: string[]){
  for(const element of position){
    const areaPosition =  element.split(':');
    if(areaPosition.length != 2){
      return;
    }
    positionCalculate([parseFloat(areaPosition[0]), parseFloat(areaPosition[1])]);
  }
}

// 緯度経度から中心位置、拡大率を求めるためにすべての合計と最大最小を取得
function positionCalculate(metaData: number[]) {
  count++;

  if (metaData != []){
    // 中心位置用のすべての合計
    centerPosition[0] += metaData[0];
    centerPosition[1] += metaData[1];

    // 初期設定
    if ((latMaxMin[0]+latMaxMin[1]) == 0 && (lonMaxMin[0]+lonMaxMin[1]) == 0){
      lonMaxMin[0] = metaData[0];
      lonMaxMin[1] = metaData[0];
      latMaxMin[0] = metaData[1];
      latMaxMin[1] = metaData[1];
    }else {
      // 各緯度の最大最小を取得
      if (lonMaxMin[0] < metaData[0]){
        lonMaxMin[0] = metaData[0];
      }else if(lonMaxMin[1] > metaData[0]){
        lonMaxMin[1] = metaData[0];
      }
      // 各経度の最大最小を取得
      if (latMaxMin[0] < metaData[1]){
        latMaxMin[0] = metaData[1];
      }else if (latMaxMin[1] > metaData[1]){
        latMaxMin[1] = metaData[1];
      }
    }
  }
}

// 細分区域のstyle
export function tileStyle(feature: RenderFeature): Style{

  const properties = feature.getProperties();

  if (parameter.areas1.indexOf(properties.code) !== -1){
    // 震度1 タイル
    return new Style({
      fill: new Fill({
        color: color('1'),
      }),
      stroke: new Stroke({
        color: color('1Stroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas2.indexOf(properties.code) !== -1){
    // 震度2 タイル
    return new Style({
      fill: new Fill({
        color: color('2'),
      }),
      stroke: new Stroke({
        color: color('2Stroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas3.indexOf(properties.code) !== -1){
    // 震度3 タイル
    return new Style({
      fill: new Fill({
        color: color('3'),
      }),
      stroke: new Stroke({
        color: color('3Stroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas4.indexOf(properties.code) !== -1){
    // 震度4 タイル
    return new Style({
      fill: new Fill({
        color: color('4'),
      }),
      stroke: new Stroke({
        color: color('4Stroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas5l.indexOf(properties.code) !== -1){
    // 震度5弱 タイル
    return new Style({
      fill: new Fill({
        color: color('5l'),
      }),
      stroke: new Stroke({
        color: color('5lStroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas5u.indexOf(properties.code) !== -1){
    // 震度5強 タイル
    return new Style({
      fill: new Fill({
        color: color('5u'),
      }),
      stroke: new Stroke({
        color: color('5uStroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas6l.indexOf(properties.code) !== -1){
    // 震度6弱 タイル
    return new Style({
      fill: new Fill({
        color: color('6l'),
      }),
      stroke: new Stroke({
        color: color('6lStroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas6u.indexOf(properties.code) !== -1){
    // 震度6強 タイル
    return new Style({
      fill: new Fill({
        color: color('6u'),
      }),
      stroke: new Stroke({
        color: color('6uStroke'),
        width: 2,
      }),
    });
  }else if(parameter.areas7.indexOf(properties.code) !== -1){
    // 震度7 タイル
    return new Style({
      fill: new Fill({
        color: color('7'),
      }),
      stroke: new Stroke({
        color: color('7Stroke'),
        width: 2,
      }),
    });
  }

  return new Style({
    fill: new Fill({
      color: color('land'),
    }),
    stroke: new Stroke({
      color: color('areaStroke'),
      width: 2,
    }),
  });
}

// 震度観測点、震源のstyle
export function pointStyle(feature: RenderFeature): Style{
  const seismicIntensity = feature.getProperties().type;

  switch(seismicIntensity){
    case 'point1':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/1.png',
      })),
      });

    case 'point2':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/2.png',
      })),
      });

    case 'point3':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/3.png',
        })),
      });

    case 'point4':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/4.png',
        })),
      });

    case 'point5l':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/5l.png',
        })),
      });

    case 'point5u':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/5u.png',
        })),
      });

    case 'point6l':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/6l.png',
        })),
      });

    case 'point6u':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/6u.png',
        })),
      });

    case 'point7':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/7.png',
        })),
      });

    case 'epi':
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */{
          scale: 1.5,
          src: 'static/icon/epi.png',
        }),
      });

    default:
      return new Style({
        image: new Icon( /** @type {olx.style.IconOptions} */ ({
          scale: 0.8,
          src: 'static/icon/1.png',
        })),
      });
  }
}
