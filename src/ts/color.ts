/**
 * @author: Yuto Watanabe
 * @version: 1.0.0
 *
 * Copyright (c) 2020 Earthquake alert
 */

export function color(type: string): string {
    const colorData : {[key: string]: string} = {
        'land': '#262626',
        'minimapLand': '#474747',
        '1': '#54cfe8',
        '2': '#64e375',
        '3': '#f0ed4d',
        '4': '#eb9423',
        '5l': '#f74d4d',
        '5u': '#f74d4d',
        '6l': '#f03eb8',
        '6u': '#f03eb8',
        '7': '#b347ed',
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
