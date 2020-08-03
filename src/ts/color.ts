export function color(type: string): string {
    const colorData : {[key: string]: string} = {
        'land': '#262626',
        'minimapLand': '#474747',
        '1': '#37a9ad',
        '2': '#37ad4d',
        '3': '#ada937',
        '4': '#ad6c37',
        '5l': '#ad3737',
        '5u': '#ad3737',
        '6l': '#ad3793',
        '6u': '#ad3793',
        '7': '#7837ad',
        '1Stroke': '#62dfe3',
        '2Stroke': '#75e089',
        '3Stroke': '#e3df6f',
        '4Stroke': '#edab74',
        '5lStroke': '#eb6767',
        '5uStroke': '#eb6767',
        '6lStroke': '#f071d4',
        '6uStroke': '#f071d4',
        '7Stroke': '#b16aeb',
        'prefCountryStroke': '#a6a6a6',
        'areaStroke': '#4a4a4a',
        'waterArea': '#5d7991',
    };
    const isColor = colorData[type];
    if (typeof isColor != 'undefined'){
        return isColor;
    }
    return '#f73325';
}
