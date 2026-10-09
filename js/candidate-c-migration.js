const CANDIDATE_C_MIGRATION_KEY = "candidateC20261009";
const CANDIDATE_C_ACTIVITY_DATE = "2026-10-09";
const CANDIDATE_C_SOURCE_DAY = 6;
const CANDIDATE_C_TARGET_DAY = 4;
const CANDIDATE_C_EXPECTED_FINGERPRINTS = {
  "profile-a": "956b5b0879d204125cf2346e70f05f36",
  "profile-b": "6a49a24ca4bff7d15ecc92509b95fd47"
};

function candidateCStableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((entry) => candidateCStableStringify(entry)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${candidateCStableStringify(value[key])}`).join(",")}}`;
}

function candidateCStateFingerprint(value) {
  const input = candidateCStableStringify(value);
  const hashes = [0x811c9dc5, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35];
  const primes = [0x01000193, 0x27d4eb2d, 0x165667b1, 0x1b873593];
  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    for (let hashIndex = 0; hashIndex < hashes.length; hashIndex += 1) {
      hashes[hashIndex] ^= code + (hashIndex * 0x9e37);
      hashes[hashIndex] = Math.imul(hashes[hashIndex], primes[hashIndex]);
    }
  }
  return hashes.map((hash) => (hash >>> 0).toString(16).padStart(8, "0")).join("");
}

function candidateCJapanDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function candidateCActivityFor(state, day) {
  return state.actualDayActivities.find((activity) => (
    activity.localDate === CANDIDATE_C_ACTIVITY_DATE
      && Number(activity.plannedDay) === day
  )) || null;
}

function candidateCNeedsMigrationReview(state) {
  if (state.migrations && state.migrations[CANDIDATE_C_MIGRATION_KEY]) return false;
  const sourceActivity = candidateCActivityFor(state, CANDIDATE_C_SOURCE_DAY);
  const targetActivity = candidateCActivityFor(state, CANDIDATE_C_TARGET_DAY);
  const datedLogs = state.walkLogs.filter((log) => candidateCJapanDate(log.timestamp) === CANDIDATE_C_ACTIVITY_DATE);
  const acquiredCount = Object.values(state.embassies)
    .filter((embassy) => embassy && embassy.status === "acquired")
    .length;
  return acquiredCount >= 74 && Boolean(
    sourceActivity
      || (targetActivity && targetActivity.addedEmbassies.length)
      || datedLogs.some((log) => Number(log.day) === CANDIDATE_C_SOURCE_DAY)
      || datedLogs.some((log) => Number(log.day) === CANDIDATE_C_TARGET_DAY)
  );
}

function migrateCandidateCReviewedState(sourceState, profile, sourceFingerprint) {
  const state = JSON.parse(JSON.stringify(sourceState));
  const sourceIndex = state.actualDayActivities.findIndex((activity) => (
    activity.localDate === CANDIDATE_C_ACTIVITY_DATE
      && Number(activity.plannedDay) === CANDIDATE_C_SOURCE_DAY
  ));
  const targetIndex = state.actualDayActivities.findIndex((activity) => (
    activity.localDate === CANDIDATE_C_ACTIVITY_DATE
      && Number(activity.plannedDay) === CANDIDATE_C_TARGET_DAY
  ));
  if (sourceIndex < 0) throw new Error("Candidate C移行元の10月9日 Day6実績が見つかりません。");

  const sourceActivity = state.actualDayActivities[sourceIndex];
  const targetActivity = targetIndex >= 0 ? state.actualDayActivities[targetIndex] : null;
  const removedIncorrectAdditions = targetActivity
    ? targetActivity.addedEmbassies.filter((entry) => entry.embassyId === "embassy-チリ")
    : [];
  const removedIncorrectEvents = targetActivity
    ? targetActivity.routeEvents.filter((entry) => entry.embassyId === "embassy-チリ")
    : [];
  const originalActivities = [targetActivity, sourceActivity].filter(Boolean).map((activity) => JSON.parse(JSON.stringify(activity)));
  const migratedActivity = {
    ...sourceActivity,
    id: activityIdFor(CANDIDATE_C_ACTIVITY_DATE, CANDIDATE_C_TARGET_DAY),
    plannedDay: CANDIDATE_C_TARGET_DAY
  };
  const firstChangedIndex = targetIndex >= 0 ? Math.min(targetIndex, sourceIndex) : sourceIndex;
  state.actualDayActivities = state.actualDayActivities.filter((_, index) => index !== sourceIndex && index !== targetIndex);
  state.actualDayActivities.splice(firstChangedIndex, 0, migratedActivity);

  const movedWalkLogs = [];
  state.walkLogs.forEach((log) => {
    if (Number(log.day) !== CANDIDATE_C_SOURCE_DAY
      || candidateCJapanDate(log.timestamp) !== CANDIDATE_C_ACTIVITY_DATE) return;
    movedWalkLogs.push({ id: log.id, previousDay: log.day });
    log.day = CANDIDATE_C_TARGET_DAY;
  });
  if (!movedWalkLogs.length) throw new Error("Candidate C移行対象の10月9日散歩記録が見つかりません。");

  state.migrations = state.migrations && typeof state.migrations === "object" ? state.migrations : {};
  state.migrations[CANDIDATE_C_MIGRATION_KEY] = {
    version: "1.0",
    profile,
    sourceFingerprint,
    appliedAt: new Date().toISOString(),
    localDate: CANDIDATE_C_ACTIVITY_DATE,
    sourceDay: CANDIDATE_C_SOURCE_DAY,
    targetDay: CANDIDATE_C_TARGET_DAY,
    originalActivities,
    movedWalkLogs,
    removedIncorrectAdditions,
    removedIncorrectEvents
  };
  return state;
}

function prepareCandidateCMigration(state) {
  const marker = state.migrations && state.migrations[CANDIDATE_C_MIGRATION_KEY];
  if (marker) {
    return { state, status: "already-applied", profile: marker.profile || "" };
  }
  if (!candidateCNeedsMigrationReview(state)) {
    return { state, status: "not-applicable", profile: "" };
  }

  const fingerprint = candidateCStateFingerprint(state);
  const profile = Object.keys(CANDIDATE_C_EXPECTED_FINGERPRINTS)
    .find((key) => CANDIDATE_C_EXPECTED_FINGERPRINTS[key] === fingerprint);
  if (!profile) {
    return {
      state,
      status: "blocked",
      profile: "",
      fingerprint,
      message: "Candidate C移行を停止しました。端末データが確認済みバックアップと一致しないため、保存データは変更していません。"
    };
  }

  return {
    state: migrateCandidateCReviewedState(state, profile, fingerprint),
    status: "applied",
    profile,
    fingerprint,
    message: "Candidate Cへ移行しました。新しいバックアップを作成してください。"
  };
}
