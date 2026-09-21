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
