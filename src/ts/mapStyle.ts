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
  epicenter: string[],
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
  epicenter: [],
};

var count: number = 0
// [lon, lat]
const centerPosition: number[] = [0, 0];
const latMaxMin: number[] = [0, 0];
const lonMaxMin: number[] = [0, 0];
var isOverseas: boolean = false;

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
  parameter.pref = getUrl(url, 'pref');

  // 震源地 [lon, lat]
  parameter.epicenter = getUrl(url, 'epi');

  addPosition(parameter.areas1);
  addPosition(parameter.areas2);
  addPosition(parameter.areas3);
  addPosition(parameter.areas4);
  addPosition(parameter.areas5l);
  addPosition(parameter.areas5u);
  addPosition(parameter.areas6l);
  addPosition(parameter.areas6u);
  addPosition(parameter.areas7);
  if (parameter.epicenter.length > 0){
    addEpicenter(parameter.epicenter);
  }

}

// 中心座標を求める
export function center(): number[] {
  if (centerPosition[0] == 0 && centerPosition[1] == 0){
    return [139.570312, 35.621581];
  }else if(isOverseas){
    // 海外の場合は日本と震源の中心をとる
    return [(139.570312+centerPosition[1]) / (count+1), (35.621581+centerPosition[0]) / (count+1)];
  }
  return [centerPosition[1] / count, centerPosition[0] / count];
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

    if(distance < 2) {
      return 9;
    }
    if(distance >= 2 && distance < 5){
      return 8;
    }
    if(distance >= 5 && distance < 7){
      return 7;
    }
    if(distance >= 7 && distance < 10){
      return 6;
    }
    if(distance >= 10 && distance < 15){
      return 5;
    }
    return 6;
  }
}

// エリアタイル（細分区域）
function addPosition(codes: string[]){
  for(let code of codes){
    const metaData = distlic(code);
    positionCalculate(metaData);
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

// style
export function tileStyle(feature: RenderFeature, resolution: number): Style{

  const properties = feature.getProperties();

  if (parameter.areas1.indexOf(properties.code) !== -1){
    // 震度1 タイル
    return new Style({
      fill: new Fill({
        color: '#37a9ad',
      }),
      stroke: new Stroke({
        color: '#62dfe3'
      }),
    });
  }else if(parameter.areas2.indexOf(properties.code) !== -1){
    // 震度2 タイル
    return new Style({
      fill: new Fill({
        color: '#37ad4d',
      }),
      stroke: new Stroke({
        color: '#75e089'
      }),
    });
  }else if(parameter.areas3.indexOf(properties.code) !== -1){
    // 震度3 タイル
    return new Style({
      fill: new Fill({
        color: '#ada937',
      }),
      stroke: new Stroke({
        color: '#e3df6f'
      }),
    });
  }else if(parameter.areas4.indexOf(properties.code) !== -1){
    // 震度4 タイル
    return new Style({
      fill: new Fill({
        color: '#ad6c37',
      }),
      stroke: new Stroke({
        color: '#edab74'
      }),
    });
  }else if(parameter.areas5l.indexOf(properties.code) !== -1){
    // 震度5弱 タイル
    return new Style({
      fill: new Fill({
        color: '#ad3737',
      }),
      stroke: new Stroke({
        color: '#eb6767'
      }),
    });
  }else if(parameter.areas5u.indexOf(properties.code) !== -1){
    // 震度5強 タイル
    return new Style({
      fill: new Fill({
        color: '#ad3737',
      }),
      stroke: new Stroke({
        color: '#eb6767'
      }),
    });
  }else if(parameter.areas6l.indexOf(properties.code) !== -1){
    // 震度6弱 タイル
    return new Style({
      fill: new Fill({
        color: '#ad3793',
      }),
      stroke: new Stroke({
        color: '#f071d4'
      }),
    });
  }else if(parameter.areas6u.indexOf(properties.code) !== -1){
    // 震度6強 タイル
    return new Style({
      fill: new Fill({
        color: '#ad3793',
      }),
      stroke: new Stroke({
        color: '#f071d4'
      }),
    });
  }else if(parameter.areas7.indexOf(properties.code) !== -1){
    // 震度7 タイル
    return new Style({
      fill: new Fill({
        color: '#7837ad',
      }),
      stroke: new Stroke({
        color: '#b16aeb'
      }),
    });
  }

  return new Style({
    fill: new Fill({
      color: '#474747',
    }),
    stroke: new Stroke({
      color: '#474747'
    }),
  });
}
