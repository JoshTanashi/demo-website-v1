import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN, MAP_STYLE, MAP_CENTER, MAP_ZOOM } from "../lib/config";

function ratingColor(score) {
  if (score == null) return "#555";
  if (score >= 4)   return "#22c55e";
  if (score >= 3)   return "#eab308";
  if (score >= 2)   return "#f97316";
  return "#ef4444";
}

export default function MapView({ places, selectedId, onSelectPlace, onMapClick, onBoundsChange }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef(new Map());

  useEffect(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl) { console.error("Mapbox GL JS not loaded"); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("style.load", () => {
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === "symbol" && layer.layout?.["text-field"]) {
          map.setPaintProperty(layer.id, "text-color", "rgba(255,255,255,0.8)");
          map.setPaintProperty(layer.id, "text-halo-color", "rgba(0,0,0,0.6)");
          map.setPaintProperty(layer.id, "text-halo-width", 1.2);
        }
      }
    });

    let ignoreNext = false;
    map.on("click", () => {
      if (ignoreNext) { ignoreNext = false; return; }
      onMapClick?.();
    });

    const emitBounds = () => onBoundsChange?.(map.getBounds());
    map.on("load",    emitBounds);
    map.on("moveend", emitBounds);

    mapRef.current = map;
    mapRef.current._ignoreNext = () => { ignoreNext = true; };

    return () => map.remove();
  }, []);

  useEffect(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl) return;
    const map = mapRef.current;
    if (!map) return;

    const existing = markersRef.current;
    const incoming = new Set(places.map((p) => p.place_id));

    for (const [id, { marker }] of existing) {
      if (!incoming.has(id)) { marker.remove(); existing.delete(id); }
    }

    for (const p of places) {
      if (existing.has(p.place_id)) {
        const { el } = existing.get(p.place_id);
        el.querySelector(".bubble-score").textContent =
          p.avg_overall != null ? p.avg_overall.toFixed(1) : "—";
        el.style.setProperty("--color", ratingColor(p.avg_overall));
      } else {
        const el = document.createElement("div");
        el.className = "bubble-marker";
        el.style.setProperty("--color", ratingColor(p.avg_overall));
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", `${p.name} · ${p.avg_overall?.toFixed(1) ?? "unrated"}`);
        el.innerHTML = `<div class="bubble-ring"></div><span class="bubble-score">${p.avg_overall != null ? p.avg_overall.toFixed(1) : "—"}</span>`;

        const activate = () => {
          mapRef.current._ignoreNext();
          onSelectPlace(p.place_id);
        };
        el.addEventListener("click", (e) => { e.stopPropagation(); activate(); });
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat(p.coords)
          .addTo(map);

        existing.set(p.place_id, { marker, el });
      }
    }
  }, [places]);

  useEffect(() => {
    for (const [id, { el }] of markersRef.current) {
      el.classList.toggle("selected", id === selectedId);
    }
    if (selectedId) {
      const p = places.find((x) => x.place_id === selectedId);
      if (p && mapRef.current) {
        const z = mapRef.current.getZoom();
        mapRef.current.easeTo({ center: p.coords, zoom: Math.min(z + 0.3, 15), duration: 600 });
      }
    }
  }, [selectedId, places]);

  return <div ref={containerRef} className="map-container" />;
}
