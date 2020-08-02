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

## 各震度の色

| 震度  |                                    色                                     |
| :---: | :-----------------------------------------------------------------------: |
|   1   | ![#37a9ad](https://via.placeholder.com/15/37a9ad/000000?text=+) `#37a9ad` |
|   2   | ![#37ad4d](https://via.placeholder.com/15/37ad4d/000000?text=+) `#37ad4d` |
|   3   | ![#ada937](https://via.placeholder.com/15/ada937/000000?text=+) `#ada937` |
|   4   | ![#ad6c37](https://via.placeholder.com/15/ad6c37/000000?text=+) `#ad6c37` |
|  5弱  | ![#ad3737](https://via.placeholder.com/15/ad3737/000000?text=+) `#ad3737` |
|  5強  | ![#ad3737](https://via.placeholder.com/15/ad3737/000000?text=+) `#ad3737` |
|  6弱  | ![#ad3793](https://via.placeholder.com/15/ad3793/000000?text=+) `#ad3793` |
|  6強  | ![#ad3793](https://via.placeholder.com/15/ad3793/000000?text=+) `#ad3793` |
|   7   | ![#7837ad](https://via.placeholder.com/15/7837ad/000000?text=+) `#7837ad` |
