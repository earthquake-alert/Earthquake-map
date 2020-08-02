import {Style, Stroke, Fill} from 'ol/style';
import RenderFeature from 'ol/render/Feature';
import {distlic} from './convertPosition';

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
}

var parameter: Parameter  = {
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
};

var count: number = 0
const centerPosition: number[] = [0, 0];

// urlからパラメータを取得
function getUrl(url: string, name: string): string[]{
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(decodeURI(url));

  if (results != null){
    return results[2].replace(/\+/g, " ").split(',');
  }
  return [];
}

export function setUrl(url: string) {
  parameter.areas1 = getUrl(url, 'areas1');
  parameter.areas2 = getUrl(url, 'areas2');
  parameter.areas3 = getUrl(url, 'areas3');
  parameter.areas4 = getUrl(url, 'areas4');
  parameter.areas5l = getUrl(url, 'areas5l');
  parameter.areas5u = getUrl(url, 'areas5u');
  parameter.areas6l = getUrl(url, 'areas6l');
  parameter.areas6u = getUrl(url, 'areas6u');
  parameter.areas7 = getUrl(url, 'areas7');
  parameter.pref = getUrl(url, 'pref');

  addPosition(parameter.areas1);
  addPosition(parameter.areas2);
  addPosition(parameter.areas3);
  addPosition(parameter.areas4);
  addPosition(parameter.areas5l);
  addPosition(parameter.areas5u);
  addPosition(parameter.areas6l);
  addPosition(parameter.areas6u);
  addPosition(parameter.areas7);

}

// 中心座標を求める
export function center(): number[] {
  if (centerPosition[0] == 0 && centerPosition[1] == 0){
    return [139.570312, 35.621581];
  }
  return [centerPosition[0] / count, centerPosition[1] / count];
}

// 各areasから緯度経度の合計を計算
function addPosition(codes: string[]){
  for(let code of codes){
    count++;
     const metaData = distlic(code);
    if (metaData != []){
      centerPosition[0] += metaData[0];
      centerPosition[1] += metaData[1];
    }
  }
}

// style
export function tileStyle(feature: RenderFeature, resolution: number): Style{

  const properties = feature.getProperties();

  if (parameter.areas1.indexOf(properties.code) !== -1){
    // 震度1 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas2.indexOf(properties.code) !== -1){
    // 震度2 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas3.indexOf(properties.code) !== -1){
    // 震度3 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas4.indexOf(properties.code) !== -1){
    // 震度4 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas5l.indexOf(properties.code) !== -1){
    // 震度5弱 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas5u.indexOf(properties.code) !== -1){
    // 震度5強 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas6l.indexOf(properties.code) !== -1){
    // 震度6弱 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas6u.indexOf(properties.code) !== -1){
    // 震度6強 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }else if(parameter.areas7.indexOf(properties.code) !== -1){
    // 震度7 タイル
    return new Style({
      fill: new Fill({
        color: '#e04a4a',
      }),
      stroke: new Stroke({
        color: '#f06767'
      }),
    });
  }

  return new Style({
    fill: new Fill({
      color: '#595959',
    }),
    stroke: new Stroke({
      color: '#636363'
    }),
  });
}
