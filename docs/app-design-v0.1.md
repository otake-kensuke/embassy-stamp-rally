# App Design v0.1

## 目的

単一HTMLファイルをOneDriveまたはiCloud Drive経由でiPhoneから開き、個人用スタンプラリー支援アプリとして使えるかを検証する。

## 画面

- ホーム: 全体進捗、Day 1、振り返り、設定への入口
- Day: NEXT大使館、地図、次/その次、取得済み、ルート展開、記録追加
- 振り返り: 取得履歴と街歩き記録の時系列表示
- 設定: メモ、JSONバックアップ書き出し、JSON復元

## NEXTロジック

標準は巡回順の未取得をNEXTにする。ルート一覧から「ここをNEXTにする」を押した場合は手動NEXTを保存する。手動NEXTが取得済みになったら解除し、再び自動NEXTへ戻る。

## データ構造

ユーザーデータは `dataVersion: "1.0"` を持つAppStateとして保存する。

```json
{
  "dataVersion": "1.0",
  "embassies": {
    "peru": {
      "status": "unvisited",
      "acquiredAt": null,
      "updatedAt": null
    }
  },
  "manualNextId": null,
  "walkLogs": [],
  "memo": "",
  "settings": {
    "activeDay": 1
  }
}
```

## UI方針

屋外、片手操作、iPhone縦持ちを前提にする。Day画面はNEXTを最上位に置き、全ルートや履歴は必要時のみ開く。
