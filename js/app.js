const CATEGORIES = ["食事", "寄り道", "発見", "休憩", "メモ"];

let state = loadState();
let activeScreen = "home";
let selectedCategory = "メモ";
let selectedRecordDate = "";
let editingLogId = null;
let toastTimer = null;
let navigationHistory = [];
let navigationIndex = -1;
let viewNextEmbassyId = null;
let viewDayMode = null;
let viewRouteEmbassyId = null;
let homeSearchQuery = "";
let worldMapRegion = "world";

const $ = (selector) => document.querySelector(selector);
const embassyById = new Map(EMBASSY_MASTER.map((embassy) => [embassy.id, embassy]));

function clearChildren(element) {
  while (element.firstChild) element.removeChild(element.firstChild);
}

function dayNumbers() {
  return [...new Set(EMBASSY_MASTER.map((embassy) => embassy.day))].sort((a, b) => a - b);
}

function dayEmbassies(day = state.settings.activeDay) {
  return EMBASSY_MASTER.filter((embassy) => embassy.day === day)
    .sort((a, b) => a.order - b.order);
}

function embassyStatus(id) {
  return state.embassies[id] || { status: "unvisited", acquiredAt: null, updatedAt: null };
}

function isNextCandidate(id) {
  const status = embassyStatus(id).status;
  return status === "unvisited" || status === "check";
}

function allAcquiredCount() {
  return EMBASSY_MASTER.filter((embassy) => embassyStatus(embassy.id).status === "acquired").length;
}

function acquiredCount(day = state.settings.activeDay) {
  return dayEmbassies(day).filter((embassy) => embassyStatus(embassy.id).status === "acquired").length;
}

function activitiesForDay(day = state.settings.activeDay) {
  return state.actualDayActivities
    .filter((activity) => Number(activity.plannedDay) === Number(day))
    .sort((a, b) => b.localDate.localeCompare(a.localDate));
}

function todayActivity(day = state.settings.activeDay) {
  const id = activityIdFor(toLocalDateKey(), day);
  return state.actualDayActivities.find((activity) => activity.id === id) || null;
}

function displayActivity(day = state.settings.activeDay) {
  return todayActivity(day) || activitiesForDay(day)[0] || null;
}

function ensureTodayActivity(day = state.settings.activeDay) {
  return ensureActualDayActivity(state, toLocalDateKey(), day);
}

function addedRouteEntries(activity = displayActivity()) {
  if (!activity) return [];
  return activity.addedEmbassies
    .map((addition, index) => ({
      addition,
      embassy: embassyById.get(addition.embassyId),
      index
    }))
    .filter((entry) => entry.embassy);
}

function routeEmbassies() {
  return [
    ...dayEmbassies(),
    ...addedRouteEntries().map((entry) => entry.embassy)
  ];
}

function getNextEmbassy() {
  const route = routeEmbassies();
  if (state.manualNextId) {
    const manual = route.find((embassy) => embassy.id === state.manualNextId);
    if (manual && isNextCandidate(manual.id)) return manual;
  }
  return route.find((embassy) => isNextCandidate(embassy.id)) || null;
}

function followingEmbassies(current) {
  const route = routeEmbassies();
  const currentIndex = current ? route.findIndex((embassy) => embassy.id === current.id) : -1;
  const after = route.slice(currentIndex + 1).filter((embassy) => isNextCandidate(embassy.id));
  const before = route.slice(0, Math.max(currentIndex, 0)).filter((embassy) => isNextCandidate(embassy.id));
  return [...after, ...before].slice(0, 2);
}

function dayProgress(day) {
  const embassies = dayEmbassies(day);
  return {
    done: embassies.filter((embassy) => embassyStatus(embassy.id).status === "acquired").length,
    total: embassies.length
  };
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatRecordDate(localDate) {
  const date = new Date(`${localDate}T00:00:00`);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function persist(options = {}) {
  state = saveState(state);
  if (options.render !== false) render();
}

function currentView(screen = activeScreen) {
  const dayMode = screen === "day"
    ? (viewDayMode || (dayProgress(state.settings.activeDay).done === dayProgress(state.settings.activeDay).total
      ? "completion"
      : "next"))
    : null;
  const current = screen === "day" && dayMode === "next"
    ? (viewNextEmbassyId ? embassyById.get(viewNextEmbassyId) : getNextEmbassy())
    : null;
  return {
    screen,
    day: state.settings.activeDay,
    recordDate: screen === "record" ? selectedRecordDate : "",
    searchQuery: screen === "search" ? homeSearchQuery : "",
    mapRegion: screen === "world-map" ? worldMapRegion : "",
    routeEmbassyId: screen === "route" ? viewRouteEmbassyId : null,
    nextEmbassyId: current ? current.id : null,
    dayMode
  };
}

function applyView(view) {
  activeScreen = view.screen;
  if (view.day) state.settings.activeDay = Number(view.day);
  if (view.recordDate) selectedRecordDate = view.recordDate;
  homeSearchQuery = view.screen === "search" ? (view.searchQuery || "") : homeSearchQuery;
  worldMapRegion = view.screen === "world-map" && WorldMapFeature.regions.includes(view.mapRegion)
    ? view.mapRegion
    : worldMapRegion;
  viewRouteEmbassyId = view.screen === "route" ? (view.routeEmbassyId || null) : null;
  viewNextEmbassyId = view.screen === "day" ? (view.nextEmbassyId || null) : null;
  viewDayMode = view.screen === "day"
    ? (view.dayMode || (dayProgress(state.settings.activeDay).done === dayProgress(state.settings.activeDay).total
      ? "completion"
      : "next"))
    : null;
  document.body.dataset.screen = activeScreen;
  state.settings.lastScreen = activeScreen === "day" || activeScreen === "route" || activeScreen === "add"
    ? "day"
    : "home";
  state = saveState(state);
  window.scrollTo({ top: 0, left: 0 });
  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.toggle("active", section.id === `${activeScreen}Screen`);
  });
  const titles = {
    home: "大使館スタンプラリー",
    days: "Day一覧",
    day: `Day ${state.settings.activeDay}`,
    route: "今日のルート",
    search: "大使館を検索",
    "world-map": "世界を旅した記録",
    add: "大使館を追加",
    review: "記録一覧",
    record: "日別記録",
    settings: "設定"
  };
  $("#screenTitle").textContent = titles[activeScreen] || "大使館スタンプラリー";
  render();
  if (activeScreen === "route" && viewRouteEmbassyId) focusRouteEmbassy(viewRouteEmbassyId);
}

function navigateTo(screen, options = {}) {
  const hasNextSnapshot = Object.prototype.hasOwnProperty.call(options, "nextEmbassyId");
  const targetDay = Number(options.day || state.settings.activeDay);
  const progress = dayProgress(targetDay);
  const dayMode = screen === "day"
    ? (options.dayMode || (progress.done === progress.total ? "completion" : "next"))
    : null;
  const current = screen === "day" && dayMode === "next" && !hasNextSnapshot ? getNextEmbassy() : null;
  const view = {
    screen,
    day: targetDay,
    recordDate: options.recordDate || "",
    searchQuery: screen === "search" ? (options.searchQuery || homeSearchQuery) : "",
    mapRegion: screen === "world-map" ? (options.mapRegion || worldMapRegion) : "",
    routeEmbassyId: screen === "route" ? (options.routeEmbassyId || null) : null,
    nextEmbassyId: screen === "day" && dayMode === "next"
      ? (hasNextSnapshot ? options.nextEmbassyId : (current ? current.id : null))
      : null,
    dayMode
  };
  navigationHistory = navigationHistory.slice(0, navigationIndex + 1);
  navigationHistory.push(view);
  navigationIndex = navigationHistory.length - 1;
  applyView(view);
}

function goBack() {
  if (navigationIndex <= 0) return;
  navigationIndex -= 1;
  applyView(navigationHistory[navigationIndex]);
}

function goForward() {
  if (navigationIndex >= navigationHistory.length - 1) return;
  navigationIndex += 1;
  applyView(navigationHistory[navigationIndex]);
}

function renderNavigation() {
  const canBack = navigationIndex > 0;
  const canForward = navigationIndex < navigationHistory.length - 1;
  $("#backButton").disabled = !canBack;
  $("#forwardButton").disabled = !canForward;
  $("#homeButton").disabled = activeScreen === "home";
  $("#homeBackButton").disabled = !canBack;
  $("#homeForwardButton").disabled = !canForward;
  $("#homeHistoryNav").hidden = activeScreen !== "home" || (!canBack && !canForward);
}

function renderProgress() {
  const total = EMBASSY_MASTER.length;
  const done = allAcquiredCount();
  const percent = total ? Math.round((done / total) * 100) : 0;
  const progress = dayProgress(state.settings.activeDay);
  $("#homeProgress").textContent = `${done} / ${total}`;
  $("#homePercent").textContent = `${percent}%`;
  $("#homeProgressBar").style.width = `${percent}%`;
  $("#homeWorldMapProgress").textContent = `${done} / ${total} 国・地域`;
  $("#dayProgress").textContent = `${progress.done} / ${progress.total}`;
  $("#routeProgress").textContent = `${progress.done} / ${progress.total}`;
}

function renderHomeDays() {
  const dayGrid = $("#dayGrid");
  clearChildren(dayGrid);
  dayNumbers().forEach((day) => {
    const progress = dayProgress(day);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-button day-tone-${day}`;
    button.classList.toggle("current", day === state.settings.activeDay);
    button.dataset.day = day;
    button.setAttribute("aria-current", day === state.settings.activeDay ? "true" : "false");

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;
    const copy = document.createElement("span");
    copy.className = "day-copy";
    const title = document.createElement("strong");
    title.textContent = `Day ${day}`;
    const label = document.createElement("span");
    label.textContent = `${progress.done} / ${progress.total} 件`;
    copy.append(title, label);
    const arrow = document.createElement("span");
    arrow.className = "day-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";
    button.append(number, copy, arrow);
    dayGrid.append(button);
  });
}

function mapControl(embassy, className = "route-map-link") {
  if (!embassy.googleMapsQuery) {
    const disabled = document.createElement("span");
    disabled.className = "disabled-map";
    disabled.textContent = "地図要確認";
    return disabled;
  }
  const link = document.createElement("a");
  link.className = className;
  link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(embassy.googleMapsQuery)}`;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "地図を開く";
  return link;
}

function renderCompletion(activity, addedEntries, addedNext) {
  const progress = dayProgress(state.settings.activeDay);
  $("#completionTitle").textContent = `Day ${state.settings.activeDay} 基本ルート完了`;
  $("#completionProgress").textContent = `${progress.done} / ${progress.total}`;
  const acquiredAdded = addedEntries.filter((entry) => embassyStatus(entry.embassy.id).status === "acquired").length;
  const stats = $("#completionStats");
  clearChildren(stats);
  [
    `基本ルート ${progress.done} / ${progress.total}`,
    `当日追加 ${acquiredAdded} / ${addedEntries.length}`,
    `今日の訪問 ${progress.done + acquiredAdded}か所`
  ].forEach((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    stats.append(span);
  });

  const container = $("#completionAdded");
  clearChildren(container);
  if (!activity || !addedEntries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "当日追加はありません。";
    container.append(empty);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "small-primary-button";
    add.dataset.screen = "add";
    add.textContent = "＋ 大使館を追加";
    container.append(add);
    return;
  }

  const heading = document.createElement("h3");
  heading.textContent = `当日追加 ${addedEntries.length}件`;
  container.append(heading);
  addedEntries.forEach(({ embassy }) => {
    const item = document.createElement("div");
    item.className = "completion-added-item";
    const text = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = embassy.embassyName;
    const detail = document.createElement("span");
    detail.textContent = `本来：Day ${embassy.day}・${embassyStatus(embassy.id).status === "acquired" ? "取得済み" : "未取得"}`;
    text.append(name, detail);
    item.append(text);
    if (addedNext && addedNext.id === embassy.id) {
      const badge = document.createElement("span");
      badge.className = "next-badge";
      badge.textContent = "当日追加のNEXT";
      item.append(badge);
    }
    container.append(item);
  });
  if (addedNext) {
    const actions = document.createElement("div");
    actions.className = "completion-added-actions";
    actions.append(mapControl(addedNext));
    const next = document.createElement("button");
    next.type = "button";
    next.dataset.next = addedNext.id;
    next.textContent = "ここをNEXTにする";
    actions.append(next);
    const acquire = document.createElement("button");
    acquire.type = "button";
    acquire.className = "completion-acquire-button";
    acquire.dataset.acquireAdded = addedNext.id;
    acquire.textContent = "スタンプを取得した";
    actions.append(acquire);
    container.append(actions);
  }
}

function renderDay() {
  const meta = DAY_META[state.settings.activeDay];
  const progress = dayProgress(state.settings.activeDay);
  const plannedComplete = progress.done === progress.total;
  const activity = displayActivity();
  const addedEntries = addedRouteEntries(activity);
  const addedNext = addedEntries.map((entry) => entry.embassy).find((embassy) => isNextCandidate(embassy.id)) || null;
  const historyCurrent = activeScreen === "day" && viewNextEmbassyId
    ? routeEmbassies().find((embassy) => embassy.id === viewNextEmbassyId) || null
    : null;
  const current = historyCurrent || getNextEmbassy();
  const showCompletion = plannedComplete && viewDayMode === "completion";
  const following = followingEmbassies(current);

  $("#dayHeading").textContent = `Day ${state.settings.activeDay} 今日のルート`;
  $("#routeHeading").textContent = `Day ${state.settings.activeDay} 今日のルート`;
  $("#dayEyebrow").textContent = `Day ${state.settings.activeDay}`;
  $("#dayStartGoal").textContent = `START ${meta.start} → GOAL ${meta.goal}`;
  $("#routeStart").textContent = meta.start;
  $("#routeGoal").textContent = meta.goal;
  $("#dayProgress").hidden = showCompletion;
  $("#activeDayContent").hidden = showCompletion;
  $("#completionPanel").hidden = !showCompletion;

  if (!showCompletion && current) {
    $("#nextEmbassyName").textContent = current.embassyName;
    $("#nextAddress").textContent = current.address;
    const hasMapQuery = Boolean(current.googleMapsQuery);
    $("#mapButton").href = hasMapQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.googleMapsQuery)}`
      : "#";
    $("#mapButton").textContent = hasMapQuery ? "地図を開く" : "地図要確認";
    $("#mapButton").setAttribute("aria-disabled", hasMapQuery ? "false" : "true");
    $("#nextOne").textContent = following[0] ? following[0].embassyName : "-";
    $("#nextTwo").textContent = following[1] ? following[1].embassyName : "-";
    const canAcquire = isNextCandidate(current.id);
    $("#acquireButton").disabled = !canAcquire;
    $("#acquireButton").textContent = canAcquire ? "スタンプを取得した" : "取得済み（履歴表示）";
  }
  const currentIsAdded = current && addedEntries.some((entry) => entry.embassy.id === current.id);
  renderCompletion(activity, addedEntries, currentIsAdded ? current : addedNext);

  const comments = getGuideComments({
    day: state.settings.activeDay,
    area: meta.area,
    complete: showCompletion,
    addedNext: Boolean(current && addedEntries.some((entry) => entry.embassy.id === current.id)),
    remaining: progress.total - progress.done,
    nextName: current ? current.embassyName : ""
  });
  $("#guideManComment").textContent = comments.man;
  $("#guideWomanComment").textContent = comments.woman;
}

function createRouteCard(embassy, options = {}) {
  const status = embassyStatus(embassy.id);
  const current = getNextEmbassy();
  const row = document.createElement("article");
  row.className = `route-row${current && current.id === embassy.id ? " current" : ""}`;
  row.dataset.routeEmbassy = embassy.id;

  const info = document.createElement("div");
  const order = document.createElement("span");
  order.className = "route-order";
  order.textContent = options.orderLabel || embassy.order;
  const name = document.createElement("strong");
  name.textContent = embassy.embassyName;
  const statusText = document.createElement("p");
  statusText.textContent = status.status === "acquired" ? `取得 ${formatTime(status.acquiredAt)}` : "未取得";
  const address = document.createElement("p");
  address.className = "route-address";
  address.textContent = embassy.address;
  info.append(order, name, statusText, address);
  if (options.added) {
    const original = document.createElement("p");
    original.className = "route-original-day";
    original.textContent = `当日追加・本来 Day ${embassy.day}`;
    info.append(original);
  }

  const actions = document.createElement("div");
  actions.className = "row-actions";
  actions.append(mapControl(embassy));
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "route-next-button";
  nextButton.dataset.next = embassy.id;
  nextButton.disabled = !isNextCandidate(embassy.id);
  nextButton.textContent = "ここをNEXTにする";
  actions.append(nextButton);

  const select = document.createElement("select");
  select.dataset.status = embassy.id;
  select.setAttribute("aria-label", `${embassy.embassyName}の状態`);
  [["unvisited", "未取得"], ["acquired", "取得済み"], ["check", "要確認"], ["skipped", "スキップ"]]
    .forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = status.status === value;
      select.append(option);
    });
  actions.append(select);

  if (options.added && status.status !== "acquired") {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-route-button";
    remove.dataset.removeAdded = embassy.id;
    remove.dataset.activityId = options.activityId;
    remove.textContent = "ルートから外す";
    actions.append(remove);
  }
  row.append(info, actions);
  return row;
}

function renderRoute() {
  const routeList = $("#routeList");
  clearChildren(routeList);
  dayEmbassies().forEach((embassy) => routeList.append(createRouteCard(embassy)));

  const addedList = $("#addedRouteList");
  clearChildren(addedList);
  const activity = displayActivity();
  const added = addedRouteEntries(activity);
  if (!added.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state route-empty";
    empty.textContent = "当日追加はありません。";
    addedList.append(empty);
  } else {
    added.forEach(({ embassy, index }) => {
      addedList.append(createRouteCard(embassy, {
        added: true,
        activityId: activity.id,
        orderLabel: `＋${index + 1}`
      }));
    });
  }
  $("#returnToDayButton").textContent = `Day ${state.settings.activeDay}へ戻る`;
}

function statusLabel(id) {
  const labels = {
    unvisited: "未取得",
    acquired: "取得済み",
    check: "要確認",
    skipped: "スキップ"
  };
  return labels[embassyStatus(id).status] || "未取得";
}

function matchingEmbassies(query) {
  const normalized = query.trim().toLocaleLowerCase("ja-JP");
  if (!normalized) return [];
  return EMBASSY_MASTER.filter((embassy) => {
    return embassy.country.toLocaleLowerCase("ja-JP").includes(normalized)
      || embassy.embassyName.toLocaleLowerCase("ja-JP").includes(normalized);
  });
}

function renderHomeSearchResults() {
  const container = $("#homeEmbassySearchResults");
  const input = $("#homeEmbassySearch");
  input.value = homeSearchQuery;
  clearChildren(container);
  if (!homeSearchQuery.trim()) {
    const prompt = document.createElement("p");
    prompt.className = "empty-state";
    prompt.textContent = "検索語を入力してください。";
    container.append(prompt);
    return;
  }

  const results = matchingEmbassies(homeSearchQuery);
  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "該当する大使館はありません。";
    container.append(empty);
    return;
  }

  results.forEach((embassy) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "embassy-lookup-result";
    button.dataset.viewEmbassy = embassy.id;
    const info = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = embassy.embassyName;
    const detail = document.createElement("span");
    detail.textContent = `Day ${embassy.day}・${statusLabel(embassy.id)}`;
    const arrow = document.createElement("span");
    arrow.className = "nav-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";
    info.append(name, detail);
    button.append(info, arrow);
    container.append(button);
  });
}

function openEmbassyInRoute(id) {
  const embassy = embassyById.get(id);
  if (!embassy) return;
  state.settings.activeDay = embassy.day;
  state = saveState(state);
  navigateTo("route", { day: embassy.day, routeEmbassyId: embassy.id });
}

function focusRouteEmbassy(id) {
  window.requestAnimationFrame(() => {
    const card = [...document.querySelectorAll("[data-route-embassy]")]
      .find((element) => element.dataset.routeEmbassy === id);
    if (!card) return;
    card.tabIndex = -1;
    card.classList.add("route-search-target");
    card.scrollIntoView({ block: "center", behavior: "auto" });
    card.focus({ preventScroll: true });
    window.setTimeout(() => card.classList.remove("route-search-target"), 2400);
  });
}

function renderSearchResults() {
  const container = $("#embassySearchResults");
  clearChildren(container);
  const query = $("#embassySearch").value.trim().toLocaleLowerCase("ja-JP");
  if (!query) {
    const prompt = document.createElement("p");
    prompt.className = "empty-state";
    prompt.textContent = "検索語を入力してください。";
    container.append(prompt);
    return;
  }

  const currentActivity = todayActivity();
  const addedIds = new Set(currentActivity ? currentActivity.addedEmbassies.map((entry) => entry.embassyId) : []);
  const plannedIds = new Set(dayEmbassies().map((embassy) => embassy.id));
  const results = matchingEmbassies(query);

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "該当する大使館はありません。";
    container.append(empty);
    return;
  }

  results.forEach((embassy) => {
    const item = document.createElement("article");
    item.className = "search-result";
    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = embassy.embassyName;
    const detail = document.createElement("p");
    detail.textContent = `本来：Day ${embassy.day}・${embassyStatus(embassy.id).status === "acquired" ? "取得済み" : "未取得"}`;
    info.append(name, detail);
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.addEmbassy = embassy.id;
    button.disabled = plannedIds.has(embassy.id) || addedIds.has(embassy.id);
    button.textContent = plannedIds.has(embassy.id)
      ? "基本ルート内"
      : addedIds.has(embassy.id) ? "追加済み" : "追加";
    item.append(info, button);
    container.append(item);
  });
}

function addedContextForAcquisition(embassyId, localDate) {
  return state.actualDayActivities.find((activity) => activity.localDate === localDate
    && activity.addedEmbassies.some((entry) => entry.embassyId === embassyId)) || null;
}

function allTimelineEvents() {
  const events = [];
  EMBASSY_MASTER.forEach((embassy) => {
    const status = embassyStatus(embassy.id);
    if (status.status !== "acquired" || !status.acquiredAt) return;
    const localDate = toLocalDateKey(status.acquiredAt);
    const activity = addedContextForAcquisition(embassy.id, localDate);
    events.push({
      type: "acquired",
      timestamp: status.acquiredAt,
      localDate,
      plannedDay: activity ? activity.plannedDay : embassy.day,
      embassy,
      addedActivity: activity
    });
  });
  state.walkLogs.forEach((log) => {
    const timestamp = log.timestamp || log.createdAt;
    if (!timestamp) return;
    events.push({
      type: "log",
      timestamp,
      localDate: toLocalDateKey(timestamp),
      plannedDay: Number(log.day) || null,
      log
    });
  });
  state.actualDayActivities.forEach((activity) => {
    activity.routeEvents.forEach((event) => {
      if (!event.timestamp) return;
      events.push({
        type: "route-added",
        timestamp: event.timestamp,
        localDate: toLocalDateKey(event.timestamp),
        plannedDay: activity.plannedDay,
        embassy: embassyById.get(event.embassyId),
        activity
      });
    });
  });
  return events.filter((event) => event.localDate).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function renderRecordList() {
  const list = $("#recordList");
  clearChildren(list);
  const events = allTimelineEvents();
  const dates = [...new Set(events.map((event) => event.localDate))].sort().reverse();
  if (!dates.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "まだ記録がありません。";
    list.append(empty);
    return;
  }

  dates.forEach((localDate) => {
    const dateEvents = events.filter((event) => event.localDate === localDate);
    const days = [...new Set(dateEvents.map((event) => event.plannedDay).filter(Boolean))].sort((a, b) => a - b);
    const stampCount = dateEvents.filter((event) => event.type === "acquired").length;
    const logCount = dateEvents.filter((event) => event.type === "log").length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-date-card";
    button.dataset.recordDate = localDate;
    const copy = document.createElement("span");
    const date = document.createElement("strong");
    date.textContent = formatRecordDate(localDate);
    const day = document.createElement("span");
    day.textContent = days.length ? days.map((value) => `Day ${value}`).join(" / ") : "街歩き記録";
    const counts = document.createElement("span");
    counts.textContent = `スタンプ ${stampCount}　記録 ${logCount}`;
    copy.append(date, day, counts);
    const arrow = document.createElement("span");
    arrow.className = "record-arrow";
    arrow.textContent = "›";
    button.append(copy, arrow);
    list.append(button);
  });
}

function renderTimeline() {
  const timeline = $("#timeline");
  clearChildren(timeline);
  if (!selectedRecordDate) return;
  const events = allTimelineEvents().filter((event) => event.localDate === selectedRecordDate);
  const days = [...new Set(events.map((event) => event.plannedDay).filter(Boolean))].sort((a, b) => a - b);
  $("#recordHeading").textContent = formatRecordDate(selectedRecordDate);
  $("#recordDayLabel").textContent = days.map((day) => `Day ${day}`).join(" / ") || "街歩き記録";

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "この日の記録はありません。";
    timeline.append(empty);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("article");
    item.className = `timeline-item timeline-${event.type}`;
    const time = document.createElement("time");
    time.dateTime = event.timestamp;
    time.textContent = formatTime(event.timestamp);
    const body = document.createElement("div");
    const title = document.createElement("strong");
    const text = document.createElement("p");

    if (event.type === "acquired") {
      title.textContent = event.embassy.embassyName;
      text.textContent = event.addedActivity
        ? `スタンプ取得・当日追加・本来 Day ${event.embassy.day}`
        : "スタンプ取得";
    } else if (event.type === "route-added") {
      title.textContent = event.embassy ? event.embassy.embassyName : "大使館を追加";
      text.textContent = event.embassy ? `当日ルートへ追加・本来 Day ${event.embassy.day}` : "当日ルートへ追加";
    } else {
      title.textContent = event.log.category || "メモ";
      text.textContent = event.log.text || "";
      const actions = document.createElement("div");
      actions.className = "timeline-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.editLog = event.log.id;
      edit.textContent = "編集";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.deleteLog = event.log.id;
      remove.textContent = "削除";
      actions.append(edit, remove);
      body.append(title, text, actions);
      item.append(time, body);
      timeline.append(item);
      return;
    }
    body.append(title, text);
    item.append(time, body);
    timeline.append(item);
  });
}

function renderCategories() {
  const categoryGrid = $("#categoryGrid");
  clearChildren(categoryGrid);
  CATEGORIES.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("selected", category === selectedCategory);
    button.dataset.category = category;
    button.textContent = category;
    categoryGrid.append(button);
  });
}

function renderWorldMapScreen() {
  if (activeScreen !== "world-map") return;
  WorldMapFeature.render($("#world-mapScreen"), state, worldMapRegion);
}

function render() {
  renderNavigation();
  renderProgress();
  renderHomeDays();
  renderDay();
  renderRoute();
  renderRecordList();
  renderTimeline();
  renderCategories();
  renderWorldMapScreen();
  if (activeScreen === "search") renderHomeSearchResults();
  if (activeScreen === "add") renderSearchResults();
  $("#memoInput").value = state.memo || "";
}

function setActiveDay(day) {
  const dayChanged = Number(state.settings.activeDay) !== Number(day);
  state.settings.activeDay = day;
  if (dayChanged) state.manualNextId = null;
  persist({ render: false });
  navigateTo("day", { day });
}

function setManualNext(id) {
  const embassy = routeEmbassies().find((entry) => entry.id === id);
  if (!embassy || !isNextCandidate(embassy.id)) return;

  state.manualNextId = embassy.id;
  state = saveState(state);
  navigateTo("day", {
    day: state.settings.activeDay,
    dayMode: "next",
    nextEmbassyId: embassy.id
  });
  showToast(`${embassy.embassyName}をNEXTに設定しました`);
}

function returnToCurrentDay() {
  const current = getNextEmbassy();
  const progress = dayProgress(state.settings.activeDay);
  const manualIsCurrent = Boolean(current && state.manualNextId === current.id);
  const dayMode = manualIsCurrent || progress.done < progress.total ? "next" : "completion";
  navigateTo("day", {
    day: state.settings.activeDay,
    dayMode,
    nextEmbassyId: dayMode === "next" && current ? current.id : null
  });
}

function setEmbassyStatus(id, nextStatus, options = {}) {
  const current = embassyStatus(id);
  if (current.status === "acquired" && nextStatus !== "acquired") {
    const ok = confirm("取得済みを未取得に戻しますか？");
    if (!ok) {
      render();
      return;
    }
  }
  const now = new Date().toISOString();
  state.embassies[id] = {
    ...current,
    status: nextStatus,
    acquiredAt: nextStatus === "acquired" ? (current.acquiredAt || now) : null,
    updatedAt: now
  };
  if (state.manualNextId === id && !isNextCandidate(id)) state.manualNextId = null;
  if (options.recordDayView && activeScreen === "day") {
    state = saveState(state);
    const next = getNextEmbassy();
    navigateTo("day", {
      day: state.settings.activeDay,
      nextEmbassyId: next ? next.id : null
    });
    return;
  }
  persist();
}

function addEmbassyToToday(id) {
  const embassy = embassyById.get(id);
  if (!embassy || embassy.day === state.settings.activeDay) return;
  const timestamp = new Date().toISOString();
  const result = addEmbassyToActivity(state, embassy, toLocalDateKey(timestamp), state.settings.activeDay, timestamp);
  if (!result.added) return;
  persist({ render: false });
  navigateTo("route");
  showToast(`${embassy.embassyName}を当日ルートへ追加しました`);
}

function removeAddedEmbassy(activityId, embassyId) {
  const activity = state.actualDayActivities.find((entry) => entry.id === activityId);
  const embassy = embassyById.get(embassyId);
  if (!activity || !embassy || embassyStatus(embassyId).status === "acquired") return;
  if (!confirm(`${embassy.embassyName}を当日ルートから外しますか？`)) return;
  const removed = removeEmbassyFromActivity(state, activityId, embassyId, false);
  if (!removed) return;
  if (state.manualNextId === embassyId) state.manualNextId = null;
  persist();
}

function openSheet(logId = null) {
  editingLogId = logId;
  const log = logId ? state.walkLogs.find((entry) => entry.id === logId) : null;
  selectedCategory = log && CATEGORIES.includes(log.category) ? log.category : "メモ";
  $("#logSheetTitle").textContent = log ? "記録を編集" : "＋記録";
  $("#logText").value = log ? (log.text || "") : "";
  renderCategories();
  $("#sheetBackdrop").hidden = false;
  $("#logSheet").hidden = false;
  $("#logText").focus();
}

function closeSheet() {
  $("#sheetBackdrop").hidden = true;
  $("#logSheet").hidden = true;
  $("#logText").value = "";
  editingLogId = null;
}

function saveWalkLog() {
  const text = $("#logText").value.trim();
  if (!text && !selectedCategory) return;
  const wasEditing = Boolean(editingLogId);
  if (editingLogId) {
    if (!updateWalkLog(state, editingLogId, selectedCategory, text, new Date().toISOString())) return;
  } else {
    state.walkLogs.push({
      id: `log-${Date.now()}`,
      day: state.settings.activeDay,
      category: selectedCategory,
      text,
      timestamp: new Date().toISOString()
    });
  }
  persist();
  closeSheet();
  showToast(wasEditing ? "記録を更新しました" : "記録を保存しました");
}

function deleteWalkLog(id) {
  const log = state.walkLogs.find((entry) => entry.id === id);
  if (!log || !confirm("この記録を削除しますか？")) return;
  if (!deleteWalkLogData(state, id)) return;
  persist();
  showToast("記録を削除しました");
}

function showToast(message) {
  const toast = $("#toastMessage");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
    toast.textContent = "";
  }, 2000);
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("button[data-screen]");
  if (nav) navigateTo(nav.dataset.screen);

  const regionButton = event.target.closest("button[data-world-region]");
  if (regionButton && activeScreen === "world-map") {
    const nextRegion = regionButton.dataset.worldRegion;
    if (WorldMapFeature.regions.includes(nextRegion)) {
      worldMapRegion = nextRegion;
      if (navigationIndex >= 0) {
        navigationHistory[navigationIndex] = {
          ...navigationHistory[navigationIndex],
          mapRegion: worldMapRegion
        };
      }
      renderWorldMapScreen();
    }
  }

  const dayButton = event.target.closest("[data-day]");
  if (dayButton) setActiveDay(Number(dayButton.dataset.day));

  const nextButton = event.target.closest("[data-next]");
  if (nextButton && !nextButton.disabled) {
    event.preventDefault();
    setManualNext(nextButton.dataset.next);
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    selectedCategory = categoryButton.dataset.category;
    renderCategories();
  }

  const addButton = event.target.closest("[data-add-embassy]");
  if (addButton && !addButton.disabled) addEmbassyToToday(addButton.dataset.addEmbassy);

  const viewEmbassyButton = event.target.closest("[data-view-embassy]");
  if (viewEmbassyButton) openEmbassyInRoute(viewEmbassyButton.dataset.viewEmbassy);

  const removeButton = event.target.closest("[data-remove-added]");
  if (removeButton) removeAddedEmbassy(removeButton.dataset.activityId, removeButton.dataset.removeAdded);

  const recordButton = event.target.closest("[data-record-date]");
  if (recordButton) navigateTo("record", { recordDate: recordButton.dataset.recordDate });

  const editButton = event.target.closest("[data-edit-log]");
  if (editButton) openSheet(editButton.dataset.editLog);

  const deleteButton = event.target.closest("[data-delete-log]");
  if (deleteButton) deleteWalkLog(deleteButton.dataset.deleteLog);

  const acquireAddedButton = event.target.closest("[data-acquire-added]");
  if (acquireAddedButton) {
    setEmbassyStatus(acquireAddedButton.dataset.acquireAdded, "acquired", { recordDayView: true });
    showToast("スタンプを取得しました");
  }
});

document.addEventListener("change", (event) => {
  const statusInput = event.target.closest("[data-status]");
  if (statusInput) setEmbassyStatus(statusInput.dataset.status, statusInput.value);
});

$("#backButton").addEventListener("click", goBack);
$("#forwardButton").addEventListener("click", goForward);
$("#homeButton").addEventListener("click", () => navigateTo("home"));
$("#homeBackButton").addEventListener("click", goBack);
$("#homeForwardButton").addEventListener("click", goForward);
$("#returnToDayButton").addEventListener("click", returnToCurrentDay);
$("#acquireButton").addEventListener("click", () => {
  const current = viewNextEmbassyId
    ? routeEmbassies().find((embassy) => embassy.id === viewNextEmbassyId)
    : getNextEmbassy();
  if (!current || !isNextCandidate(current.id)) return;
  setEmbassyStatus(current.id, "acquired", { recordDayView: true });
  showToast("スタンプを取得しました");
});
$("#embassySearch").addEventListener("input", renderSearchResults);
$("#homeEmbassySearch").addEventListener("input", (event) => {
  homeSearchQuery = event.target.value;
  if (activeScreen === "search" && navigationIndex >= 0) {
    navigationHistory[navigationIndex] = {
      ...navigationHistory[navigationIndex],
      searchQuery: homeSearchQuery
    };
  }
  renderHomeSearchResults();
});
$("#openLogSheet").addEventListener("click", () => openSheet());
$("#closeLogSheet").addEventListener("click", closeSheet);
$("#sheetBackdrop").addEventListener("click", closeSheet);
$("#saveLog").addEventListener("click", saveWalkLog);
$("#memoInput").addEventListener("input", (event) => {
  state.memo = event.target.value;
  state = saveState(state);
});
$("#exportButton").addEventListener("click", () => downloadBackup(state));
$("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const previousState = state;
  try {
    const candidate = await readBackupFile(file);
    const prepared = prepareState(candidate);
    if (prepared.error) {
      $("#settingsMessage").textContent = prepared.error;
      return;
    }
    state = prepared.state;
    state = saveState(state);
    $("#settingsMessage").textContent = prepared.migrated
      ? "旧Backupをv1.1へ移行して復元しました。"
      : "復元しました。";
    navigationHistory = [];
    navigationIndex = -1;
    const restoredScreen = state.settings.lastScreen === "day" ? "day" : "home";
    navigateTo(restoredScreen);
  } catch (error) {
    state = previousState;
    $("#settingsMessage").textContent = error.message;
  } finally {
    event.target.value = "";
  }
});

const initialScreen = state.settings.lastScreen === "day" ? "day" : "home";
navigationHistory = [currentView(initialScreen)];
navigationIndex = 0;
applyView(navigationHistory[0]);
