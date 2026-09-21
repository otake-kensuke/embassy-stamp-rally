const STORAGE_KEY = "embassyStampRally.appState";
const DATA_VERSION = "1.1";
const LEGACY_DATA_VERSION = "1.0";
const VALID_STATUSES = new Set(["unvisited", "acquired", "check", "skipped"]);

function cloneStateValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function toLocalDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function activityIdFor(localDate, plannedDay) {
  return `activity-${localDate}-day-${plannedDay}`;
}

function createInitialState() {
  const embassies = {};
  EMBASSY_MASTER.forEach((embassy) => {
    embassies[embassy.id] = {
      status: "unvisited",
      acquiredAt: null,
      updatedAt: null
    };
  });

  return {
    dataVersion: DATA_VERSION,
    embassies,
    manualNextId: null,
    actualDayActivities: [],
    walkLogs: [],
    memo: "",
    migrations: {},
    settings: {
      activeDay: 1,
      lastScreen: "home"
    }
  };
}

function migrateV10ToV11(rawState) {
  const migrated = cloneStateValue(rawState);
  migrated.dataVersion = DATA_VERSION;
  migrated.actualDayActivities = Array.isArray(migrated.actualDayActivities)
    ? migrated.actualDayActivities
    : [];
  migrated.migrations = migrated.migrations && typeof migrated.migrations === "object"
    ? migrated.migrations
    : {};

  const norwayId = "embassy-ノルウェー";
  const norway = EMBASSY_MASTER.find((embassy) => embassy.id === norwayId);
  const norwayState = migrated.embassies && migrated.embassies[norwayId];
  const dayOneComplete = EMBASSY_MASTER
    .filter((embassy) => embassy.day === 1)
    .every((embassy) => migrated.embassies
      && migrated.embassies[embassy.id]
      && migrated.embassies[embassy.id].status === "acquired");

  if (norway
    && norwayState
    && norwayState.status === "acquired"
    && norwayState.acquiredAt
    && dayOneComplete) {
    const localDate = toLocalDateKey(norwayState.acquiredAt);
    if (localDate) {
      const id = activityIdFor(localDate, 1);
      let activity = migrated.actualDayActivities.find((entry) => entry && entry.id === id);
      if (!activity) {
        activity = {
          id,
          localDate,
          plannedDay: 1,
          addedEmbassies: [],
          routeEvents: []
        };
        migrated.actualDayActivities.push(activity);
      }
      activity.addedEmbassies = Array.isArray(activity.addedEmbassies)
        ? activity.addedEmbassies
        : [];
      activity.routeEvents = Array.isArray(activity.routeEvents) ? activity.routeEvents : [];
      if (!activity.addedEmbassies.some((entry) => entry.embassyId === norwayId)) {
        activity.addedEmbassies.push({
          embassyId: norwayId,
          masterDay: norway.day,
          addedAt: null,
          source: "migration"
        });
      }
      migrated.migrations.v07NorwayDay1 = true;
    }
  }

  return migrated;
}

function normalizeV11State(rawState) {
  const base = createInitialState();
  const source = cloneStateValue(rawState);
  const normalized = {
    ...base,
    ...source,
    dataVersion: DATA_VERSION,
    embassies: { ...base.embassies, ...(source.embassies || {}) },
    settings: { ...base.settings, ...(source.settings || {}) },
    migrations: source.migrations && typeof source.migrations === "object"
      ? source.migrations
      : {},
    actualDayActivities: Array.isArray(source.actualDayActivities)
      ? source.actualDayActivities.map((activity) => ({
        ...activity,
        addedEmbassies: Array.isArray(activity.addedEmbassies) ? activity.addedEmbassies : [],
        routeEvents: Array.isArray(activity.routeEvents) ? activity.routeEvents : []
      }))
      : [],
    walkLogs: Array.isArray(source.walkLogs) ? source.walkLogs : []
  };

  EMBASSY_MASTER.forEach((embassy) => {
    normalized.embassies[embassy.id] = {
      ...base.embassies[embassy.id],
      ...(source.embassies && source.embassies[embassy.id] ? source.embassies[embassy.id] : {})
    };
  });

  const validDays = new Set(EMBASSY_MASTER.map((embassy) => embassy.day));
  if (!validDays.has(Number(normalized.settings.activeDay))) {
    normalized.settings.activeDay = 1;
  } else {
    normalized.settings.activeDay = Number(normalized.settings.activeDay);
  }
  normalized.settings.lastScreen = normalized.settings.lastScreen === "day" ? "day" : "home";
  return normalized;
}

function validateStateV11(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return "JSONの形式が正しくありません。";
  }
  if (candidate.dataVersion !== DATA_VERSION) {
    return `dataVersionが${DATA_VERSION}ではありません。`;
  }
  if (!candidate.embassies || typeof candidate.embassies !== "object") {
    return "大使館データが見つかりません。";
  }
  if (!Array.isArray(candidate.walkLogs)) {
    return "記録データの形式が正しくありません。";
  }
  if (!Array.isArray(candidate.actualDayActivities)) {
    return "当日実績データの形式が正しくありません。";
  }
  if (!candidate.settings || typeof candidate.settings !== "object") {
    return "設定データが見つかりません。";
  }

  for (const embassy of EMBASSY_MASTER) {
    const saved = candidate.embassies[embassy.id];
    if (!saved || !VALID_STATUSES.has(saved.status)) {
      return `${embassy.embassyName}の取得状態が正しくありません。`;
    }
  }

  const validDays = new Set(EMBASSY_MASTER.map((embassy) => embassy.day));
  const embassyById = new Map(EMBASSY_MASTER.map((embassy) => [embassy.id, embassy]));
  const activityIds = new Set();
  for (const activity of candidate.actualDayActivities) {
    if (!activity || typeof activity !== "object"
      || typeof activity.id !== "string"
      || !/^\d{4}-\d{2}-\d{2}$/.test(activity.localDate || "")
      || !validDays.has(Number(activity.plannedDay))
      || !Array.isArray(activity.addedEmbassies)
      || !Array.isArray(activity.routeEvents)) {
      return "当日実績データの内容が正しくありません。";
    }
    if (activityIds.has(activity.id)) {
      return "当日実績データが重複しています。";
    }
    activityIds.add(activity.id);
    const addedIds = new Set();
    for (const added of activity.addedEmbassies) {
      const master = added && embassyById.get(added.embassyId);
      if (!master || Number(added.masterDay) !== master.day || addedIds.has(added.embassyId)) {
        return "当日追加大使館データの内容が正しくありません。";
      }
      addedIds.add(added.embassyId);
    }
  }
  return "";
}

function prepareState(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return { state: null, migrated: false, error: "JSONの形式が正しくありません。" };
  }

  let working;
  let migrated = false;
  if (candidate.dataVersion === LEGACY_DATA_VERSION) {
    working = migrateV10ToV11(candidate);
    migrated = true;
  } else if (candidate.dataVersion === DATA_VERSION) {
    working = cloneStateValue(candidate);
  } else {
    return {
      state: null,
      migrated: false,
      error: `対応していないdataVersionです: ${String(candidate.dataVersion || "未設定")}`
    };
  }

  const normalized = normalizeV11State(working);
  const error = validateStateV11(normalized);
  return error
    ? { state: null, migrated, error }
    : { state: normalized, migrated, error: "" };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const prepared = prepareState(JSON.parse(saved));
    if (prepared.error) throw new Error(prepared.error);
    if (prepared.migrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prepared.state));
    }
    return prepared.state;
  } catch (error) {
    console.warn("Saved state could not be loaded. Original storage was not changed.", error);
    return createInitialState();
  }
}

function saveState(state) {
  const prepared = prepareState(state);
  if (prepared.error) throw new Error(prepared.error);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prepared.state));
  return prepared.state;
}

function validateImportState(candidate) {
  return prepareState(candidate).error;
}
