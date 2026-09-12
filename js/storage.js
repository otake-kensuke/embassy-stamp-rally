const STORAGE_KEY = "embassyStampRally.appState";
const DATA_VERSION = "1.0";

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
    walkLogs: [],
    memo: "",
    settings: {
      activeDay: 1
    }
  };
}

function normalizeState(rawState) {
  const base = createInitialState();
  if (!rawState || rawState.dataVersion !== DATA_VERSION) return base;

  const normalized = {
    ...base,
    ...rawState,
    embassies: { ...base.embassies, ...(rawState.embassies || {}) },
    settings: { ...base.settings, ...(rawState.settings || {}) },
    walkLogs: Array.isArray(rawState.walkLogs) ? rawState.walkLogs : []
  };

  EMBASSY_MASTER.forEach((embassy) => {
    normalized.embassies[embassy.id] = {
      ...base.embassies[embassy.id],
      ...(rawState.embassies && rawState.embassies[embassy.id] ? rawState.embassies[embassy.id] : {})
    };
  });

  return normalized;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    return normalizeState(JSON.parse(saved));
  } catch (error) {
    console.warn("Saved state could not be loaded.", error);
    return createInitialState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
}

function validateImportState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return "JSONの形式が正しくありません。";
  }
  if (candidate.dataVersion !== DATA_VERSION) {
    return `dataVersionが${DATA_VERSION}ではありません。`;
  }
  if (!candidate.embassies || typeof candidate.embassies !== "object") {
    return "大使館データが見つかりません。";
  }
  if (candidate.walkLogs && !Array.isArray(candidate.walkLogs)) {
    return "記録データの形式が正しくありません。";
  }
  return "";
}
