const CURRENT_ROUTE_PLAN = {
  id: "candidate-b-prime-2026-10-06",
  status: "PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED",
  recoveryCandidateIds: ["embassy-ベナン", "embassy-ザンビア"],
  unlocatedIds: ["embassy-アフガニスタン"],
  days: {
    4: {
      estimatedWalkingKm: 7.61,
      estimatedWalkingMinutes: 102,
      embassyIds: [
        "embassy-キューバ",
        "embassy-ハイチ",
        "embassy-ホンジュラス",
        "embassy-パラオ",
        "embassy-サモア",
        "embassy-ナミビア",
        "embassy-エクアドル",
        "embassy-カザフスタン",
        "embassy-トンガ",
        "embassy-ナイジェリア",
        "embassy-コソボ",
        "embassy-モーリシャス",
        "embassy-アルバニア",
        "embassy-ベネズエラ"
      ]
    },
    5: {
      estimatedWalkingKm: 12.3,
      estimatedWalkingMinutes: 164,
      embassyIds: [
        "embassy-アンゴラ",
        "embassy-ブルキナファソ",
        "embassy-ベトナム",
        "embassy-ブルガリア",
        "embassy-ラトビア",
        "embassy-ヨルダン",
        "embassy-イラク",
        "embassy-ニュージーランド",
        "embassy-モンゴル",
        "embassy-レバノン",
        "embassy-マレーシア",
        "embassy-UAE",
        "embassy-ギニア",
        "embassy-セネガル",
        "embassy-エジプト",
        "embassy-デンマーク",
        "embassy-リビア"
      ]
    },
    6: {
      estimatedWalkingKm: 11.34,
      estimatedWalkingMinutes: 151,
      embassyIds: [
        "embassy-グアテマラ",
        "embassy-ロシア",
        "embassy-フィジー",
        "embassy-ボリビア",
        "embassy-チリ",
        "embassy-イタリア",
        "embassy-キルギス",
        "embassy-シンガポール",
        "embassy-オーストリア",
        "embassy-リトアニア",
        "embassy-サンマリノ",
        "embassy-中国",
        "embassy-ポルトガル",
        "embassy-ラオス",
        "embassy-コスタリカ",
        "embassy-ガーナ",
        "embassy-トルクメニスタン"
      ]
    },
    7: {
      estimatedWalkingKm: 10.81,
      estimatedWalkingMinutes: 144,
      embassyIds: [
        "embassy-クウェート",
        "embassy-ウズベキスタン",
        "embassy-スリランカ",
        "embassy-アルゼンチン",
        "embassy-ジャマイカ",
        "embassy-スロバキア",
        "embassy-マダガスカル",
        "embassy-カタール",
        "embassy-ウクライナ",
        "embassy-ルーマニア",
        "embassy-ギリシャ",
        "embassy-エルサルバドル",
        "embassy-パナマ",
        "embassy-サウジアラビア",
        "embassy-マルタ",
        "embassy-オランダ",
        "embassy-ウルグアイ"
      ]
    },
    8: {
      estimatedWalkingKm: 12.6,
      estimatedWalkingMinutes: 168,
      embassyIds: [
        "embassy-フィリピン",
        "embassy-オーストラリア",
        "embassy-ハンガリー",
        "embassy-ジンバブエ",
        "embassy-エチオピア",
        "embassy-マラウイ",
        "embassy-エリトリア",
        "embassy-タジキスタン",
        "embassy-インドネシア",
        "embassy-ベラルーシ",
        "embassy-北マケドニア",
        "embassy-マリ",
        "embassy-コートジボワール",
        "embassy-タイ",
        "embassy-コロンビア",
        "embassy-アルジェリア",
        "embassy-ポーランド"
      ]
    },
    9: {
      estimatedWalkingKm: 12.61,
      estimatedWalkingMinutes: 169,
      embassyIds: [
        "embassy-スーダン",
        "embassy-カメルーン",
        "embassy-モーリタニア",
        "embassy-ネパール",
        "embassy-パプアニューギニア",
        "embassy-ミクロネシア",
        "embassy-ボツワナ",
        "embassy-セルビア",
        "embassy-アイスランド",
        "embassy-ブルネイ",
        "embassy-ジブチ",
        "embassy-ミャンマー"
      ]
    },
    10: {
      estimatedWalkingKm: 14.14,
      estimatedWalkingMinutes: 189,
      mode: "public-transit-hybrid",
      embassyIds: [
        "embassy-タンザニア",
        "embassy-モザンビーク",
        "embassy-ガボン",
        "embassy-アゼルバイジャン",
        "embassy-トーゴ",
        "embassy-ケニア",
        "embassy-ルワンダ",
        "embassy-マーシャル諸島",
        "embassy-コンゴ共和国"
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

function routePlanEmbassies(day) {
  const masterById = new Map(EMBASSY_MASTER.map((embassy) => [embassy.id, embassy]));
  return routePlanIdsForDay(day)
    .map((id, index) => {
      const embassy = masterById.get(id);
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
  const masterById = new Map(EMBASSY_MASTER.map((embassy) => [embassy.id, embassy]));
  return CURRENT_ROUTE_PLAN.recoveryCandidateIds
    .map((id) => masterById.get(id))
    .filter(Boolean);
}

function recoveryCandidateProgress(statusForId) {
  const ids = CURRENT_ROUTE_PLAN.recoveryCandidateIds;
  const done = ids.filter((id) => statusForId(id) === "acquired").length;
  return {
    done,
    total: ids.length,
    complete: done === ids.length
  };
}

function isUnlocatedRouteCandidate(id) {
  return CURRENT_ROUTE_PLAN.unlocatedIds.includes(id);
}
