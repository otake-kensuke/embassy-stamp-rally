const CURRENT_ROUTE_PLAN = {
  id: "candidate-c-2026-10-09",
  status: "PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED",
  recoveryCandidateIds: [],
  unlocatedIds: [],
  mapUnconfirmedIds: ["embassy-アフガニスタン", "embassy-トルクメニスタン"],
  addressOverrides: {
    "embassy-トルクメニスタン": {
      address: "〒106-0046 東京都港区元麻布2-8-4",
      googleMapsQuery: "トルクメニスタン大使館 東京都港区元麻布2-8-4",
      locationNote: "公式ラリーのスタンプ取得地点は要確認"
    }
  },
  days: {
    4: {
      actualDate: "2026-10-09",
      actualRoute: true,
      embassyIds: [
        "embassy-チリ", "embassy-キューバ", "embassy-トンガ", "embassy-ボリビア",
        "embassy-グアテマラ", "embassy-ホンジュラス", "embassy-ハイチ", "embassy-フィジー",
        "embassy-ロシア", "embassy-サモア", "embassy-ナミビア", "embassy-エクアドル",
        "embassy-パラオ", "embassy-アフガニスタン", "embassy-カザフスタン", "embassy-キルギス",
        "embassy-オーストラリア", "embassy-イタリア", "embassy-ハンガリー", "embassy-クウェート",
        "embassy-ジンバブエ", "embassy-スリランカ", "embassy-ウズベキスタン"
      ]
    },
    5: {
      estimatedWalkingKm: 11.6,
      estimatedWalkingMinutesRange: [155, 174],
      embassyIds: [
        "embassy-アンゴラ", "embassy-ブルキナファソ", "embassy-ベトナム", "embassy-ブルガリア",
        "embassy-ラトビア", "embassy-ヨルダン", "embassy-イラク", "embassy-ニュージーランド",
        "embassy-モンゴル", "embassy-レバノン", "embassy-マレーシア", "embassy-UAE",
        "embassy-ギニア", "embassy-セネガル", "embassy-エジプト", "embassy-デンマーク",
        "embassy-リビア"
      ]
    },
    6: {
      estimatedWalkingKm: 11.3,
      estimatedWalkingMinutesRange: [151, 170],
      loadLabel: "23件・高負荷コース",
      embassyIds: [
        "embassy-コスタリカ", "embassy-パナマ", "embassy-フィリピン", "embassy-シンガポール",
        "embassy-オーストリア", "embassy-アルゼンチン", "embassy-トルクメニスタン", "embassy-スロバキア",
        "embassy-ジャマイカ", "embassy-サンマリノ", "embassy-リトアニア", "embassy-ラオス",
        "embassy-エルサルバドル", "embassy-ガーナ", "embassy-ルーマニア", "embassy-ギリシャ",
        "embassy-ウクライナ", "embassy-中国", "embassy-ポルトガル", "embassy-カタール",
        "embassy-マダガスカル", "embassy-ポーランド", "embassy-アルジェリア"
      ]
    },
    7: {
      estimatedWalkingKm: 8.2,
      estimatedWalkingMinutesRange: [109, 123],
      embassyIds: [
        "embassy-サウジアラビア", "embassy-オランダ", "embassy-マルタ", "embassy-ナイジェリア",
        "embassy-コソボ", "embassy-ウルグアイ", "embassy-モーリシャス", "embassy-アルバニア",
        "embassy-ベネズエラ"
      ]
    },
    8: {
      estimatedWalkingKm: 12.1,
      estimatedWalkingMinutesRange: [161, 181],
      embassyIds: [
        "embassy-マラウイ", "embassy-エチオピア", "embassy-エリトリア", "embassy-タジキスタン",
        "embassy-インドネシア", "embassy-ベラルーシ", "embassy-北マケドニア", "embassy-コートジボワール",
        "embassy-タイ", "embassy-コロンビア", "embassy-マリ", "embassy-ザンビア",
        "embassy-ボツワナ", "embassy-ジブチ", "embassy-ミャンマー", "embassy-ブルネイ",
        "embassy-セルビア", "embassy-アイスランド"
      ]
    },
    9: {
      estimatedWalkingKm: 11.5,
      estimatedWalkingMinutesRange: [153, 172],
      embassyIds: [
        "embassy-モーリタニア", "embassy-ミクロネシア", "embassy-パプアニューギニア", "embassy-ネパール",
        "embassy-カメルーン", "embassy-ガボン", "embassy-アゼルバイジャン", "embassy-スーダン",
        "embassy-トーゴ", "embassy-ケニア"
      ]
    },
    10: {
      estimatedWalkingKm: 11.7,
      mode: "public-transit-hybrid",
      embassyIds: [
        "embassy-タンザニア", "embassy-モザンビーク", "embassy-マーシャル諸島",
        "embassy-ルワンダ", "embassy-コンゴ共和国", "embassy-ベナン"
      ],
      travelSegments: [
        {
          label: "徒歩 1：用賀駅 → 田園調布駅",
          travelMode: "walking",
          origin: "用賀駅",
          destination: "田園調布駅",
          embassyIds: [
            "embassy-タンザニア", "embassy-モザンビーク", "embassy-マーシャル諸島",
            "embassy-ルワンダ", "embassy-コンゴ共和国"
          ]
        },
        {
          label: "鉄道：田園調布駅 → 後楽園駅",
          travelMode: "transit",
          origin: "田園調布駅",
          destination: "後楽園駅",
          embassyIds: []
        },
        {
          label: "徒歩 2：後楽園駅 → ベナン → 後楽園駅",
          travelMode: "walking",
          origin: "後楽園駅",
          destination: "後楽園駅",
          embassyIds: ["embassy-ベナン"]
        }
      ]
    }
  }
};

function routePlanDayNumbers() {
  return Object.keys(DAY_META).map(Number).sort((a, b) => a - b);
}

function routePlanIdsForDay(day) {
  const numericDay = Number(day);
  if (numericDay <= 3) {
    return EMBASSY_MASTER
      .filter((embassy) => embassy.day === numericDay)
      .sort((a, b) => a.order - b.order)
      .map((embassy) => embassy.id);
  }
  return [...(CURRENT_ROUTE_PLAN.days[numericDay]?.embassyIds || [])];
}

function routePlanEmbassyById(id) {
  const embassy = EMBASSY_MASTER.find((entry) => entry.id === id);
  if (!embassy) return null;
  const override = CURRENT_ROUTE_PLAN.addressOverrides[id];
  return override
    ? {
      ...embassy,
      address: override.address,
      googleMapsQuery: override.googleMapsQuery,
      routeLocationNote: override.locationNote
    }
    : { ...embassy };
}

function routePlanEmbassies(day) {
  return routePlanIdsForDay(day)
    .map((id, index) => {
      const embassy = routePlanEmbassyById(id);
      return embassy ? { ...embassy, routeOrder: index + 1 } : null;
    })
    .filter(Boolean);
}

function routePlanDayForEmbassy(id) {
  for (const day of routePlanDayNumbers()) {
    if (routePlanIdsForDay(day).includes(id)) return day;
  }
  return null;
}

function isRecoveryCandidate(id) {
  return CURRENT_ROUTE_PLAN.recoveryCandidateIds.includes(id);
}

function recoveryCandidateEmbassies() {
  return CURRENT_ROUTE_PLAN.recoveryCandidateIds
    .map((id) => routePlanEmbassyById(id))
    .filter(Boolean);
}

function recoveryCandidateProgress(statusForId) {
  const ids = CURRENT_ROUTE_PLAN.recoveryCandidateIds;
  const done = ids.filter((id) => statusForId(id) === "acquired").length;
  return {
    done,
    total: ids.length,
    complete: ids.length > 0 && done === ids.length
  };
}

function isUnlocatedRouteCandidate(id) {
  return CURRENT_ROUTE_PLAN.unlocatedIds.includes(id);
}

function routePlanTravelSegmentsForDay(day) {
  return [...(CURRENT_ROUTE_PLAN.days[Number(day)]?.travelSegments || [])];
}
