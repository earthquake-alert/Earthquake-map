import {Style, Stroke, Fill} from 'ol/style';
import StyleFunction from 'ol/style/Style'
import RenderFeature from 'ol/render/Feature';

export default function(feature: RenderFeature, resolution: number): Style{
    const properties = feature.getProperties();

    console.log(properties);

    if (properties.prefName == '茨城県' || properties.distlictCode == '040010' || properties.prefCode == '450000'){
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
