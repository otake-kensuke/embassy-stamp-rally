const CATEGORIES = ["食事", "寄り道", "発見", "休憩", "メモ"];

let state = loadState();
let activeScreen = "home";
let selectedCategory = "メモ";

const $ = (selector) => document.querySelector(selector);

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function dayEmbassies() {
  return EMBASSY_MASTER.filter((embassy) => embassy.day === state.settings.activeDay)
    .sort((a, b) => a.order - b.order);
}

function embassyStatus(id) {
  return state.embassies[id] || { status: "unvisited", acquiredAt: null };
}

function isNextCandidate(id) {
  const status = embassyStatus(id).status;
  return status === "unvisited" || status === "check";
}

function acquiredCount() {
  return dayEmbassies().filter((embassy) => embassyStatus(embassy.id).status === "acquired").length;
}

function getNextEmbassy() {
  const embassies = dayEmbassies();
  if (state.manualNextId) {
    const manual = embassies.find((embassy) => embassy.id === state.manualNextId);
    if (manual && isNextCandidate(manual.id)) return manual;
  }
  return embassies.find((embassy) => isNextCandidate(embassy.id)) || null;
}

function followingEmbassies(current) {
  const remaining = dayEmbassies().filter((embassy) => {
    return embassy.id !== (current && current.id) && isNextCandidate(embassy.id);
  });
  if (!current) return remaining.slice(0, 2);

  const later = remaining.filter((embassy) => embassy.order > current.order);
  const earlier = remaining.filter((embassy) => embassy.order < current.order);
  return [...later, ...earlier].slice(0, 2);
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function persist() {
  saveState(state);
  render();
}

function setScreen(screen) {
  activeScreen = screen;
  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.toggle("active", section.id === `${screen}Screen`);
  });
  $("#backButton").style.visibility = screen === "home" ? "hidden" : "visible";
  $("#screenTitle").textContent = {
    home: "大使館ラリー",
    day: "Day 1",
    review: "振り返り",
    settings: "設定"
  }[screen];
  render();
}

function renderProgress() {
  const total = dayEmbassies().length;
  const done = acquiredCount();
  const percent = total ? Math.round((done / total) * 100) : 0;
  $("#homeProgress").textContent = `${done} / ${total}`;
  $("#homePercent").textContent = `${percent}%`;
  $("#homeProgressBar").style.width = `${percent}%`;
  $("#dayProgress").textContent = `${done} / ${total}`;
}

function renderDay() {
  const current = getNextEmbassy();
  const following = followingEmbassies(current);
  const panel = $("#nextPanel");

  panel.classList.toggle("complete", !current);
  $("#nextEmbassyName").textContent = current ? current.embassyName : "Day 1 完了";
  $("#nextAddress").textContent = current ? current.address : "すべて取得済みです。";
  $("#mapButton").href = current ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.googleMapsQuery)}` : "#";
  $("#mapButton").setAttribute("aria-disabled", current ? "false" : "true");
  $("#nextOne").textContent = following[0] ? following[0].embassyName : "-";
  $("#nextTwo").textContent = following[1] ? following[1].embassyName : "-";
  $("#acquireButton").disabled = !current;
  $("#acquireButton").textContent = current ? "✓ 取得済み" : "完了";

  const routeList = $("#routeList");
  clearChildren(routeList);

  dayEmbassies().forEach((embassy) => {
    const status = embassyStatus(embassy.id);
    const isCurrent = current && current.id === embassy.id;
    const row = document.createElement("div");
    row.className = `route-row${isCurrent ? " current" : ""}`;

    const info = document.createElement("div");
    const order = document.createElement("span");
    order.className = "route-order";
    order.textContent = embassy.order;
    const name = document.createElement("strong");
    name.textContent = embassy.embassyName;
    const statusText = document.createElement("p");
    statusText.textContent = status.status === "acquired" ? `取得 ${formatTime(status.acquiredAt)}` : "未取得";
    info.append(order, name, statusText);

    const actions = document.createElement("div");
    actions.className = "row-actions";
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.dataset.next = embassy.id;
    nextButton.disabled = !isNextCandidate(embassy.id);
    nextButton.textContent = "ここをNEXTにする";

    const select = document.createElement("select");
    select.dataset.status = embassy.id;
    select.setAttribute("aria-label", `${embassy.embassyName}の状態`);
    [
      ["unvisited", "未取得"],
      ["acquired", "取得済み"],
      ["check", "要確認"],
      ["skipped", "スキップ"]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = status.status === value;
      select.append(option);
    });
    actions.append(nextButton, select);
    row.append(info, actions);
    routeList.append(row);
  });
}

function renderTimeline() {
  const acquiredEvents = dayEmbassies()
    .map((embassy) => ({ embassy, status: embassyStatus(embassy.id) }))
    .filter((entry) => entry.status.status === "acquired" && entry.status.acquiredAt)
    .map((entry) => ({
      timestamp: entry.status.acquiredAt,
      title: entry.embassy.embassyName,
      body: "✓ 取得"
    }));

  const logEvents = state.walkLogs.map((log) => ({
    timestamp: log.timestamp,
    title: log.category || "メモ",
    body: log.text || ""
  }));

  const events = [...acquiredEvents, ...logEvents]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const timeline = $("#timeline");
  clearChildren(timeline);

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "まだ記録がありません。";
    timeline.append(empty);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    const time = document.createElement("time");
    time.textContent = formatTime(event.timestamp);
    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = event.title;
    const text = document.createElement("p");
    text.textContent = event.body;
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

function render() {
  renderProgress();
  renderDay();
  renderTimeline();
  renderCategories();
  $("#memoInput").value = state.memo || "";
}

function setEmbassyStatus(id, nextStatus) {
  const current = embassyStatus(id);
  if (current.status === "acquired" && nextStatus === "unvisited") {
    const ok = confirm("取得済みを未取得に戻しますか？");
    if (!ok) {
      render();
      return;
    }
  }

  state.embassies[id] = {
    ...current,
    status: nextStatus,
    acquiredAt: nextStatus === "acquired" ? (current.acquiredAt || new Date().toISOString()) : null,
    updatedAt: new Date().toISOString()
  };

  if (state.manualNextId === id && !isNextCandidate(id)) {
    state.manualNextId = null;
  }
  persist();
}

function openSheet() {
  $("#sheetBackdrop").hidden = false;
  $("#logSheet").hidden = false;
  $("#logText").focus();
}

function closeSheet() {
  $("#sheetBackdrop").hidden = true;
  $("#logSheet").hidden = true;
  $("#logText").value = "";
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-screen]");
  if (nav) setScreen(nav.dataset.screen);

  const nextButton = event.target.closest("[data-next]");
  if (nextButton) {
    state.manualNextId = nextButton.dataset.next;
    persist();
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    selectedCategory = categoryButton.dataset.category;
    renderCategories();
  }
});

document.addEventListener("change", (event) => {
  const statusInput = event.target.closest("[data-status]");
  if (statusInput) setEmbassyStatus(statusInput.dataset.status, statusInput.value);
});

$("#backButton").addEventListener("click", () => setScreen("home"));
$("#acquireButton").addEventListener("click", () => {
  const current = getNextEmbassy();
  if (current) setEmbassyStatus(current.id, "acquired");
});
$("#openLogSheet").addEventListener("click", openSheet);
$("#closeLogSheet").addEventListener("click", closeSheet);
$("#sheetBackdrop").addEventListener("click", closeSheet);
$("#saveLog").addEventListener("click", () => {
  const text = $("#logText").value.trim();
  if (!text && !selectedCategory) return;
  state.walkLogs.push({
    id: `log-${Date.now()}`,
    category: selectedCategory,
    text,
    timestamp: new Date().toISOString()
  });
  persist();
  closeSheet();
});
$("#memoInput").addEventListener("input", (event) => {
  state.memo = event.target.value;
  saveState(state);
});
$("#exportButton").addEventListener("click", () => downloadBackup(state));
$("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const candidate = await readBackupFile(file);
    const error = validateImportState(candidate);
    if (error) {
      $("#settingsMessage").textContent = error;
      return;
    }
    state = normalizeState(candidate);
    saveState(state);
    $("#settingsMessage").textContent = "復元しました。";
    persist();
  } catch (error) {
    $("#settingsMessage").textContent = error.message;
  } finally {
    event.target.value = "";
  }
});

setScreen("home");
