function findActualDayActivity(appState, localDate, plannedDay) {
  const id = activityIdFor(localDate, plannedDay);
  return appState.actualDayActivities.find((activity) => activity.id === id) || null;
}

function ensureActualDayActivity(appState, localDate, plannedDay) {
  let activity = findActualDayActivity(appState, localDate, plannedDay);
  if (!activity) {
    activity = {
      id: activityIdFor(localDate, plannedDay),
      localDate,
      plannedDay,
      addedEmbassies: [],
      routeEvents: []
    };
    appState.actualDayActivities.push(activity);
  }
  return activity;
}

function addEmbassyToActivity(appState, embassy, localDate, plannedDay, timestamp) {
  const activity = ensureActualDayActivity(appState, localDate, plannedDay);
  if (activity.addedEmbassies.some((entry) => entry.embassyId === embassy.id)) {
    return { activity, added: false };
  }
  activity.addedEmbassies.push({
    embassyId: embassy.id,
    masterDay: embassy.day,
    addedAt: timestamp,
    source: "user"
  });
  activity.routeEvents.push({
    id: `route-${timestamp}-${embassy.id}`,
    type: "route-added",
    embassyId: embassy.id,
    timestamp
  });
  return { activity, added: true };
}

function removeEmbassyFromActivity(appState, activityId, embassyId, acquired) {
  const activity = appState.actualDayActivities.find((entry) => entry.id === activityId);
  if (!activity || acquired || !activity.addedEmbassies.some((entry) => entry.embassyId === embassyId)) {
    return false;
  }
  activity.addedEmbassies = activity.addedEmbassies.filter((entry) => entry.embassyId !== embassyId);
  activity.routeEvents = activity.routeEvents.filter((event) => event.embassyId !== embassyId);
  return true;
}
