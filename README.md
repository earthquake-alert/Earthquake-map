# Earthquake Map

## TL;DR

地震・津波に関する地図の描画。

- 震度分布図（震度観測点）
  - 用途: 震源・震度に関する情報
- 震度分布図（都道府県のタイル）
  - 緊急地震速報等
- 震度分布図（細分区域のタイル）
  - 震度速報
- 津波警報・注意報図
  - 津波注意報
  - 津波警報
  - 大津波警報

## Run

```bash
# installs (need yarn and pipenv installed)
yarn install
pipenv install

# build
yarn run build

# run server
pipenv shell
>>> python src/main.py

# connect to http://localhost:5000/
```
