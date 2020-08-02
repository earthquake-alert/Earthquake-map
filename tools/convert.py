import csv
import json
import os


def main(path: str):
    converted_dict = {}
    converted_txt = '{\n'

    with open(path) as fp:
        reader = csv.reader(fp)
        for element in reader:
            converted_dict[element[0]] = [element[1], element[2], element[3]]
            converted_txt += (f'\'{element[0]}\': ' +
                              '{' + f'lat: \'{element[3]}\', lon: \'{element[2]}\', name: \'{element[1]}\',' + '},\n')

    with open(os.path.join(os.path.dirname(path), 'converted.json'), mode='w') as contents:
        json.dump(converted_dict, contents, indent=4, ensure_ascii=False)

    converted_txt += '}'
    with open(os.path.join(os.path.dirname(path), 'converted.ts'), mode='w') as contents:
        contents.write(converted_txt)


if __name__ == "__main__":
    main('tools/jma_area_centroid.csv')
