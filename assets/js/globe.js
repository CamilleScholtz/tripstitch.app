// Spinning Mapbox globe for the homepage hero. The basemap matches the iOS
// app (Standard style, day light preset, Inter labels); the atmosphere is
// tuned for the website's summer-sky hero instead of the app's defaults.
(() => {
  const container = document.getElementById("globe");
  if (!container || typeof mapboxgl === "undefined") return;

  const token = container.dataset.token;
  if (!token) return;
  mapboxgl.accessToken = token;

  const DESTINATIONS = [
    [139.69, 35.68], // Tokyo
    [135.5, 34.69], // Osaka
    [126.98, 37.57], // Seoul
    [121.56, 25.03], // Taipei
    [114.17, 22.32], // Hong Kong
    [103.85, 1.29], // Singapore
    [100.5, 13.76], // Bangkok
    [105.85, 21.03], // Hanoi
    [115.19, -8.41], // Bali
    [77.21, 28.61], // Delhi
    [72.88, 19.08], // Mumbai
    [55.27, 25.2], // Dubai
    [28.98, 41.01], // Istanbul
    [23.73, 37.98], // Athens
    [18.09, 42.65], // Dubrovnik
    [12.5, 41.9], // Rome
    [16.37, 48.21], // Vienna
    [14.44, 50.08], // Prague
    [13.41, 52.52], // Berlin
    [4.9, 52.37], // Amsterdam
    [5.12, 52.09], // Utrecht
    [-0.13, 51.51], // London
    [2.35, 48.86], // Paris
    [-3.7, 40.42], // Madrid
    [2.17, 41.39], // Barcelona
    [-8.61, 41.15], // Porto
    [-9.14, 38.72], // Lisbon
    [-21.94, 64.15], // Reykjavik
    [-7.99, 31.63], // Marrakesh
    [31.24, 30.04], // Cairo
    [36.82, -1.29], // Nairobi
    [18.42, -33.92], // Cape Town
    [-74.01, 40.71], // New York
    [-79.38, 43.65], // Toronto
    [-123.12, 49.28], // Vancouver
    [-122.42, 37.77], // San Francisco
    [-118.24, 34.05], // Los Angeles
    [-157.86, 21.31], // Honolulu
    [-99.13, 19.43], // Mexico City
    [-86.85, 21.16], // Cancún
    [-43.17, -22.91], // Rio de Janeiro
    [-58.38, -34.6], // Buenos Aires
    [-71.97, -13.53], // Cusco
    [151.21, -33.87], // Sydney
    [174.76, -36.85], // Auckland
    [168.66, -45.03], // Queenstown
  ];

  // "Recently created trips": each marker fades in, sits there pulsing, then
  // fades back out on its own staggered cycle. The vis/pulse properties feed
  // the data-driven paint expressions below and are rewritten every frame.
  const MARKER_CYCLE = 10; // seconds: fade in, hold, fade out, rest
  const MARKER_FADE = 0.8; // seconds spent fading in/out
  const MARKER_HOLD = 7; // seconds a marker is on screen per cycle
  const MARKER_PULSE = 2.4; // seconds per ripple
  const markers = DESTINATIONS.map((coordinates, i) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates },
    properties: { vis: 1, pulse: 0.35, offset: i * 1.7 },
  }));
  let markersReady = false;

  const updateMarkers = (nowSec) => {
    for (const marker of markers) {
      const p = marker.properties;
      const t = (nowSec + p.offset) % MARKER_CYCLE;
      if (t < MARKER_FADE) p.vis = t / MARKER_FADE;
      else if (t < MARKER_HOLD - MARKER_FADE) p.vis = 1;
      else if (t < MARKER_HOLD) p.vis = (MARKER_HOLD - t) / MARKER_FADE;
      else p.vis = 0;
      p.pulse = p.vis > 0 ? ((nowSec + p.offset) % MARKER_PULSE) / MARKER_PULSE : 0;
    }
    map.getSource("destinations").setData({ type: "FeatureCollection", features: markers });
  };

  // The visible globe disc is ~512·2^z/π px wide. Hero-lab variants size the
  // sphere relative to their own container via data-sphere-ratio (and an
  // optional data-sphere-max in px); the default hero sizes from the viewport.
  const ratio = parseFloat(container.dataset.sphereRatio) || 0;
  const maxDiameter = parseFloat(container.dataset.sphereMax) || Infinity;
  const sphereDiameter = () => {
    const w = container.clientWidth;
    if (ratio) return Math.min(maxDiameter, w * ratio);
    return w < 768 ? w * 0.9 : Math.min(840, w * 0.54);
  };
  const zoomForWidth = () =>
    Math.min(4.5, Math.max(0.6, Math.log2((sphereDiameter() * Math.PI) / 512)));

  let map;
  try {
    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/standard",
      projection: "globe",
      center: [10, 24],
      zoom: zoomForWidth(),
      interactive: false,
      attributionControl: false,
      logoPosition: "bottom-left",
    });
  } catch {
    return;
  }
  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "top-right");

  map.on("style.load", () => {
    map.setConfigProperty("basemap", "lightPreset", "day");
    map.setConfigProperty("basemap", "font", "Inter");
    map.setConfigProperty("basemap", "showPointOfInterestLabels", false);

    // The app's atmosphere: bright white halo hugging the globe, deep dark
    // blue space with stars around it. Blend is nudged up from the app's
    // 0.03 so the halo stays fat at this low whole-globe zoom.
    // data-sky="day" swaps the space backdrop for a daytime sky.
    map.setFog(
      container.dataset.sky === "day"
        ? {
            color: "#FFFFFF",
            "high-color": "#B7D8F6",
            "space-color": "#9CC6EE",
            "horizon-blend": 0.1,
            "star-intensity": 0,
            range: [0.4, 11],
          }
        : {
            color: "#FFFFFF",
            "high-color": "#245CDF",
            "space-color": "#010B19",
            "horizon-blend": 0.06,
            "star-intensity": 0.35,
            range: [0.4, 11],
          }
    );

    map.addSource("destinations", {
      type: "geojson",
      data: { type: "FeatureCollection", features: markers },
    });
    // Expanding ripple behind each dot, fading as it grows
    map.addLayer({
      id: "destination-halo",
      type: "circle",
      source: "destinations",
      slot: "top",
      paint: {
        "circle-radius": ["+", 4, ["*", 16, ["get", "pulse"]]],
        "circle-color": "#E4956A",
        "circle-opacity": ["*", 0.45, ["get", "vis"], ["-", 1, ["get", "pulse"]]],
        "circle-blur": 0.4,
      },
    });
    map.addLayer({
      id: "destination-dot",
      type: "circle",
      source: "destinations",
      slot: "top",
      paint: {
        "circle-radius": 4.5,
        "circle-color": "#E4956A",
        "circle-opacity": ["get", "vis"],
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-width": 1.5,
        "circle-stroke-opacity": ["get", "vis"],
      },
    });
    markersReady = true;
  });

  const DEGREES_PER_SECOND = 360 / 220;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let last;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(container);

  const spin = (now) => {
    if (last !== undefined && visible && !reduceMotion.matches) {
      const { lng, lat } = map.getCenter();
      map.setCenter([lng + ((now - last) / 1000) * DEGREES_PER_SECOND, lat]);
      if (markersReady) updateMarkers(now / 1000);
    }
    last = now;
    requestAnimationFrame(spin);
  };

  map.on("load", () => {
    container.closest(".hero-globe").classList.add("is-live");
    requestAnimationFrame(spin);
  });

  window.addEventListener("resize", () => map.setZoom(zoomForWidth()));
})();
