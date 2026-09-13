# Data Validation v0.5

## Source

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

## Result

- Total: 157 / 157
- Unique IDs: 157 / 157
- Existing Day1 IDs preserved: PASS
- Valid Google Maps query: 156 / 157
- Missing Google Maps query: 1 / 157

## Day Counts

| Day | Expected | Actual |
| --- | ---: | ---: |
| Day1 | 13 | 13 |
| Day2 | 14 | 14 |
| Day3 | 19 | 19 |
| Day4 | 18 | 18 |
| Day5 | 16 | 16 |
| Day6 | 16 | 16 |
| Day7 | 22 | 22 |
| Day8 | 21 | 21 |
| Day9 | 10 | 10 |
| Day10 | 8 | 8 |
| Total | 157 | 157 |

## Google Maps Issue

Primary Source上で、Day10のアフガニスタンはMap欄が `要確認` であり、通常のGoogle Maps URLではない。

実装では推測補完せず、地図ボタンを無効表示にする。

## 重点確認5件

| Country | Day | Order | Address | Google Maps query |
| --- | ---: | ---: | --- | --- |
| ハイチ | 7 | 13 | 〒106-0044 東京都港区東麻布1-10-11 | PASS |
| ジブチ | 8 | 2 | 〒141-0001 東京都品川区北品川5-13-1 | PASS |
| ボツワナ | 8 | 7 | 〒141-0022 東京都品川区東五反田3-18-6 | PASS |
| コートジボワール | 8 | 8 | 〒141-0021 東京都品川区上大崎3-8-5 | PASS |
| モーリタニア | 8 | 21 | 〒153-0053 東京都目黒区五本木1-16-17 | PASS |
