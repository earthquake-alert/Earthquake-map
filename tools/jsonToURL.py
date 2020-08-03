import json
import os


def main(path: str):
    url = 'http://localhost:5000/'
    with open(path, mode='r') as contents:
        json_body = json.load(contents)

    epi = json_body['epicenter']
    url += f'?epi={epi[1]},{epi[0]}'

    areas = json_body['areas']

    for si in areas:
        position = []
        for element in areas[si]:
            position.append(f'{element[1]}:{element[0]}')
        url += f'&point{si}={",".join(position)}'

    # save url
    with open(os.path.join(os.path.dirname(path), 'converted.txt'), mode='w') as contents:
        contents.write(url)


if __name__ == "__main__":
    main('tools/TohokuEarthquake.json')
