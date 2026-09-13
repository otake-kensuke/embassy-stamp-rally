# App Design v0.4

## 目的

正式マスターのDay1 13件をPrototypeへ取り込み、実データでも現在のNEXT中心UI、GitHub Pages配信、iPhone Safari、`localStorage`保存、JSON Backup / Restoreの設計が成立するかを確認する。

## Primary Source

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

使用シート:

```text
Day01 実行表
```

取り込み対象はDay1の13件のみ。157件全体への展開は行わない。

## データ方針

- 国名、スポット名、住所、Day、巡回順はPrimary Sourceに従う
- `googleMapsQuery` はPrimary SourceのMap列の `query` と同じ文字列を使う
- 既存の `EMBASSY_MASTER` 構造を維持する
- `localStorage` の `dataVersion: "1.0"` は変更しない
- 既存のPrototype 5件は正式Day1 13件に置き換える

## UI方針

画面構成、ボタン、文言、NEXTロジック、Backup / Restoreの操作方法はv0.3から変更しない。今回の目的は機能追加ではなく、実データでの成立確認とする。

## Day1 13件

1. ペルー大使館
2. チェコ大使館
3. クロアチア大使館
4. オマーン大使館
5. スイス大使館
6. ボスニア・ヘルツェゴビナ大使館
7. フランス大使館
8. パキスタン大使館
9. キプロス大使館
10. ドイツ大使館
11. フィンランド大使館
12. イラン大使館
13. 韓国大使館
