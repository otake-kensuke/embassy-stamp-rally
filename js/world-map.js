(function initializeWorldMapFeature() {
  const MAP_DATA_URL = "data/world-map/ne_110m_admin_0_countries.geojson?v=5.1.2";
  const MAPPING_DATA_URL = "data/world-map/embassy-country-mapping-v0.8.json?v=0.8";
  const D3_URL = "vendor/d3.v7.9.0.min.js?v=7.9.0";
  const LAND_COLOR = "#E6EEE9";
  const NON_TARGET_COLOR = "#F5F8F6";

  const REGIONS = {
    world: { label: "世界", kicker: "WORLD", appRegion: null, continents: null, bounds: null },
    europe: { label: "欧州", kicker: "EUROPE", appRegion: "Europe", continents: ["Europe"], bounds: [[-25, 32], [45, 73]] },
    asia: { label: "アジア", kicker: "ASIA", appRegion: "Asia", continents: ["Asia"], bounds: [[25, -12], [179, 80]] },
    africa: { label: "アフリカ", kicker: "AFRICA", appRegion: "Africa", continents: ["Africa"], bounds: [[-25, -38], [55, 38]] },
    americas: { label: "北米・中南米", kicker: "AMERICAS", appRegion: "Americas", continents: ["North America", "South America"], bounds: [[-170, -60], [-28, 84]] },
    oceania: {
      label: "オセアニア",
      kicker: "OCEANIA",
      appRegion: "Oceania",
      continents: ["Oceania"],
      bounds: [[105, -52], [-155, 15]],
      rotation: [-160, 0]
    }
  };

  const REGION_COLORS = {
    Europe: "#347FD1",
    Asia: "#DF7B2D",
    Africa: "#C99618",
    Americas: "#D85D70",
    Oceania: "#7C63C7"
  };

  let assetsPromise = null;
  let renderSequence = 0;

  function loadD3() {
    if (window.d3) return Promise.resolve(window.d3);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src^="${D3_URL.split("?")[0]}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.d3), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = D3_URL;
      script.onload = () => resolve(window.d3);
      script.onerror = () => reject(new Error("D3を読み込めませんでした"));
      document.head.append(script);
    });
  }

  function fetchJson(url) {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`データを読み込めませんでした (${response.status})`);
      return response.json();
    });
  }

  function loadAssets() {
    if (!assetsPromise) {
      assetsPromise = Promise.all([
        loadD3(),
        fetchJson(MAP_DATA_URL),
        fetchJson(MAPPING_DATA_URL)
      ]).then(([d3, mapData, mappingData]) => ({ d3, mapData, rows: mappingData.rows }));
    }
    return assetsPromise;
  }

  function boundsAnchor(bounds) {
    const [[west, south], [east, north]] = bounds;
    return {
      type: "MultiPoint",
      coordinates: [[west, south], [east, south], [east, north], [west, north]]
    };
  }

  function projectionFor(d3, mapData, region) {
    const target = region.bounds
      ? boundsAnchor(region.bounds)
      : { type: "FeatureCollection", features: mapData.features };
    const projection = d3.geoNaturalEarth1();
    if (region.rotation) projection.rotate(region.rotation);
    return projection.fitExtent([[18, 18], [742, 412]], target);
  }

  function acquiredIds(state) {
    return new Set(Object.entries(state.embassies || {})
      .filter(([, embassy]) => embassy && embassy.status === "acquired")
      .map(([id]) => id));
  }

  function rowsForRegion(rows, region) {
    return region.appRegion ? rows.filter((row) => row.appRegion === region.appRegion) : rows;
  }

  function featureBelongsToRegion(feature, region) {
    return !region.continents || region.continents.includes(feature.properties.CONTINENT);
  }

  function appendTitle(selection, text) {
    selection.selectAll("title").remove();
    selection.append("title").text(text);
  }

  function renderLegend(root, regionKey) {
    const legend = root.querySelector("#worldMapLegend");
    legend.replaceChildren();
    const regionNames = regionKey === "world"
      ? Object.keys(REGION_COLORS)
      : [REGIONS[regionKey].appRegion];
    const labels = {
      Europe: "欧州",
      Asia: "アジア",
      Africa: "アフリカ",
      Americas: "北米・中南米",
      Oceania: "オセアニア"
    };

    regionNames.forEach((name) => {
      const item = document.createElement("span");
      const swatch = document.createElement("i");
      swatch.style.background = REGION_COLORS[name];
      item.append(swatch, labels[name]);
      legend.append(item);
    });

    const pending = document.createElement("span");
    const pendingSwatch = document.createElement("i");
    pendingSwatch.style.background = LAND_COLOR;
    pending.append(pendingSwatch, "未取得");
    legend.append(pending);

    const marker = document.createElement("span");
    const markerSwatch = document.createElement("i");
    markerSwatch.className = "marker-key";
    marker.append(markerSwatch, "小国・島国marker");
    legend.append(marker);
  }

  function renderCountryList(root, rows, acquired, region) {
    const visible = rowsForRegion(rows, region)
      .filter((row) => acquired.has(row.embassyId))
      .sort((a, b) => a.masterDay - b.masterDay || a.masterOrder - b.masterOrder);
    const list = root.querySelector("#worldMapCountryList");
    list.replaceChildren();
    root.querySelector("#worldMapVisitedCount").textContent = `${visible.length}件`;

    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "world-map-empty";
      empty.textContent = "まだ取得した国・地域はありません";
      list.append(empty);
      return;
    }

    visible.forEach((row) => {
      const chip = document.createElement("span");
      chip.className = "world-map-country-chip";
      chip.style.setProperty("--chip-color", row.regionColor);
      chip.textContent = row.countryOrRegionNameJa;
      list.append(chip);
    });
  }

  function renderLoaded(root, state, regionKey, assets) {
    const region = REGIONS[regionKey] || REGIONS.world;
    const acquired = acquiredIds(state);
    const regionRows = rowsForRegion(assets.rows, region);
    const acquiredRows = regionRows.filter((row) => acquired.has(row.embassyId));
    const rowByAdm0A3 = new Map(assets.rows.map((row) => [row.naturalEarthAdm0A3, row]));
    const projection = projectionFor(assets.d3, assets.mapData, region);
    const path = assets.d3.geoPath(projection);
    const svg = assets.d3.select(root.querySelector("#worldMapSvg"));
    const countryLayer = svg.select("#worldMapCountryLayer");
    const markerLayer = svg.select("#worldMapMarkerLayer");
    const visibleFeatures = assets.mapData.features.filter((feature) => featureBelongsToRegion(feature, region));

    svg.selectAll(".world-map-sphere,.world-map-graticule").remove();
    svg.insert("path", "#worldMapCountryLayer")
      .datum({ type: "Sphere" })
      .attr("class", "world-map-sphere")
      .attr("d", path);
    svg.insert("path", "#worldMapCountryLayer")
      .datum(assets.d3.geoGraticule10())
      .attr("class", "world-map-graticule")
      .attr("d", path);

    const countries = countryLayer.selectAll("path")
      .data(visibleFeatures, (feature) => feature.properties.ADM0_A3)
      .join("path")
      .attr("d", path)
      .attr("class", (feature) => {
        const row = rowByAdm0A3.get(feature.properties.ADM0_A3);
        if (!row) return "world-map-country non-target";
        return `world-map-country${acquired.has(row.embassyId) ? " acquired" : ""}`;
      })
      .attr("fill", (feature) => {
        const row = rowByAdm0A3.get(feature.properties.ADM0_A3);
        if (!row) return NON_TARGET_COLOR;
        return acquired.has(row.embassyId) ? row.regionColor : LAND_COLOR;
      });

    appendTitle(countries, (feature) => {
      const row = rowByAdm0A3.get(feature.properties.ADM0_A3);
      if (!row) return feature.properties.NAME_JA || feature.properties.NAME_EN;
      return `${row.countryOrRegionNameJa}・${acquired.has(row.embassyId) ? "取得済み" : "未取得"}`;
    });

    const markers = regionRows.filter((row) => row.renderMethod === "marker");
    const markerGroups = markerLayer.selectAll("g")
      .data(markers, (row) => row.countryCode)
      .join("g")
      .attr("class", (row) => `world-map-marker${acquired.has(row.embassyId) ? " acquired" : " pending"}`)
      .attr("role", "img")
      .attr("aria-label", (row) => `${row.countryOrRegionNameJa}、${acquired.has(row.embassyId) ? "取得済み" : "未取得"}`)
      .attr("transform", (row) => {
        const point = projection([row.markerLongitude, row.markerLatitude]);
        return point ? `translate(${point[0]},${point[1]})` : "translate(-100,-100)";
      });
    const markerRadius = regionKey === "world" ? 4 : 7;
    markerGroups.selectAll("circle").remove();
    markerGroups.append("circle")
      .attr("class", "world-map-marker-outline")
      .attr("r", markerRadius + 2);
    markerGroups.append("circle")
      .attr("class", "world-map-marker-dot")
      .attr("r", markerRadius)
      .attr("fill", (row) => acquired.has(row.embassyId) ? row.regionColor : LAND_COLOR)
      .attr("stroke", (row) => acquired.has(row.embassyId) ? "#FFFFFF" : "#6D887E");
    appendTitle(markerGroups, (row) => `${row.countryOrRegionNameJa}・${acquired.has(row.embassyId) ? "取得済み" : "未取得"}`);

    root.querySelector("#worldMapKicker").textContent = region.kicker;
    root.querySelector("#worldMapRegionName").textContent = region.label;
    root.querySelector("#worldMapCount").textContent = `${acquiredRows.length} / ${regionRows.length}`;
    root.querySelector("#worldMapPanelKicker").textContent = `${region.kicker} MAP`;
    root.querySelector("#worldMapPanelTitle").textContent = region.label;
    root.querySelector("#worldMapSvgTitle").textContent = `${region.label}の取得状況`;
    root.querySelector("#worldMapSvgDescription").textContent = `${region.label}の取得済み国・地域を地域別の色で表示します。取得済み${acquiredRows.length}件、対象${regionRows.length}件です。`;
    root.querySelector("#worldMapStatus").textContent = `取得済み ${acquiredRows.length}件`;
    root.querySelector("#worldMapLoading").hidden = true;
    root.querySelectorAll("[data-world-region]").forEach((tab) => {
      const selected = tab.dataset.worldRegion === regionKey;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    renderLegend(root, regionKey);
    renderCountryList(root, assets.rows, acquired, region);
  }

  async function render(root, state, regionKey = "world") {
    const sequence = ++renderSequence;
    root.querySelector("#worldMapLoading").hidden = false;
    root.querySelector("#worldMapLoading").textContent = "地図を読み込んでいます";
    try {
      const assets = await loadAssets();
      if (sequence !== renderSequence || !root.classList.contains("active")) return;
      renderLoaded(root, state, REGIONS[regionKey] ? regionKey : "world", assets);
    } catch (error) {
      if (sequence !== renderSequence) return;
      root.querySelector("#worldMapLoading").hidden = false;
      root.querySelector("#worldMapLoading").textContent = "地図を読み込めませんでした";
      root.querySelector("#worldMapStatus").textContent = "読み込みエラー";
      console.error("World Map could not be rendered.", error);
    }
  }

  window.WorldMapFeature = {
    render,
    regions: Object.keys(REGIONS),
    regionColors: { ...REGION_COLORS }
  };
}());
