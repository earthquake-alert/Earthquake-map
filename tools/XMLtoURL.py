'''
@author: Yuto Watanabe
@version: 1.0.0

Copyright (c) 2020 Earthquake alert
'''
import os
import time

import xmltodict


def main():
    '''
    convert xml to json.

    Args:
        file_num (int): file number.
    '''
    start = time.time()

    xml_fp = 'tools/sample.xml'

    with open(xml_fp) as f:
        text_list = f.readlines()

    text = '\n'.join(text_list)

    xml_root = xmltodict.parse(text)

    output = convert_report(xml_root)

    url = 'http://localhost:5000/?'

    url += f'ti={output["title"]}'

    for areas in output['areas']:
        codes = []
        si = ''
        for code in output['areas'][areas]:
            codes.append(str(code))

        if areas == '震度７':
            si = '7'
        elif areas == '震度６強':
            si = '6u'
        elif areas == '震度６弱':
            si = '6l'
        elif areas == '震度５強':
            si = '5u'
        elif areas == '震度５弱':
            si = '6l'
        elif areas == '震度４':
            si = '4'
        elif areas == '震度３':
            si = '3'
        url += f'&areas{si}={",".join(codes)}'

    # save url
    with open(os.path.join(os.path.dirname(xml_fp), 'converted.txt'), mode='w') as contents:
        contents.write(url)

    print(f'Time: {time.time() - start}')


def convert_report(earthquake):
    '''
    Extract the XML of "Seismic intensity bulletin" to json.
    Args:
        earthquake (Any): XML data.
        cache_file_path (str): cache file path.
    Returns:
        Any: The extracted data.
    '''
    title = earthquake['Report']['Head']['Title']

    explanation = []
    explanation.append(earthquake['Report']['Head']['Headline']['Text'])
    try:
        explanation.append(earthquake['Report']['Body']['Comments']['ForecastComment']['Text'])
    except KeyError:
        pass

    areas = earthquake['Report']['Head']['Headline']['Information']
    if isinstance(areas, list):
        information = areas[0]['Item']
    else:
        information = areas['Item']

    formated_areas = {}
    if isinstance(information, list):
        max_seismic_intensity = information[0]['Kind']['Name']
        for individual in information:
            seismic_intensity = individual['Kind']['Name']
            areas = []
            if isinstance(individual['Areas']['Area'], list):
                for area in individual['Areas']['Area']:
                    areas.append(area['Code'])
            else:
                areas.append(individual['Areas']['Area']['Name'])
            formated_areas[seismic_intensity] = areas
    else:
        max_seismic_intensity = information['Kind']['Name']
        seismic_intensity = information['Kind']['Name']
        areas = []
        if isinstance(information['Areas']['Area'], list):
            for area in information['Areas']['Area']:
                areas.append(area['Name'])
        else:
            areas.append(information['Areas']['Area']['Code'])
        formated_areas[seismic_intensity] = areas

    if max_seismic_intensity in {'震度1', '震度１'}:
        formated_seismic_intensity = '1'
    elif max_seismic_intensity in {'震度2', '震度２'}:
        formated_seismic_intensity = '2'
    elif max_seismic_intensity in {'震度3', '震度３'}:
        formated_seismic_intensity = '3'
    elif max_seismic_intensity in {'震度4', '震度４'}:
        formated_seismic_intensity = '4'
    elif max_seismic_intensity in {'震度5弱', '震度５弱'}:
        formated_seismic_intensity = '5-'
    elif max_seismic_intensity in {'震度5強', '震度５強'}:
        formated_seismic_intensity = '5+'
    elif max_seismic_intensity in {'震度6弱', '震度６弱'}:
        formated_seismic_intensity = '6-'
    elif max_seismic_intensity in {'震度6強', '震度６強'}:
        formated_seismic_intensity = '6+'
    elif max_seismic_intensity in {'震度7', '震度7'}:
        formated_seismic_intensity = '7'
    else:
        formated_seismic_intensity = '0'

    output = {
        'title': title,
        'max_seismic_intensity': formated_seismic_intensity,
        'explanation': explanation,
        'areas': formated_areas
    }

    return output


if __name__ == "__main__":
    main()
