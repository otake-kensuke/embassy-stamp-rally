function resolveWalkLogDayContext(screen, view) {
  const day = Number(view && view.day);
  return screen === "day" && Number.isInteger(day) && day >= 1 && day <= 10 ? day : null;
}

function addWalkLogData(appState, day, category, text, timestamp, id) {
  const normalizedDay = Number(day);
  if (!Number.isInteger(normalizedDay) || normalizedDay < 1 || normalizedDay > 10) return null;
  const log = { id, day: normalizedDay, category, text, timestamp };
  appState.walkLogs.push(log);
  return log;
}

function updateWalkLog(appState, id, category, text, updatedAt) {
  const log = appState.walkLogs.find((entry) => entry.id === id);
  if (!log) return false;
  log.category = category;
  log.text = text;
  log.updatedAt = updatedAt;
  return true;
}

function deleteWalkLogData(appState, id) {
  const before = appState.walkLogs.length;
  appState.walkLogs = appState.walkLogs.filter((entry) => entry.id !== id);
  return appState.walkLogs.length < before;
}
