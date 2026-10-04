"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  formatDistance,
  googleDirectionsUrl,
  haversineKm,
  MAP_ZOOM,
  osmDirectionsUrl,
  type GeoPoint,
  type HospitalLocation,
} from "@/lib/location";

type L = typeof import("leaflet");
type LeafletMap = ReturnType<L["map"]>;

interface Place {
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  boundingBox?: [number, number, number, number];
}

const HOSPITAL_ICON = `
  <div class="relative h-[46px] w-[34px]">
    <div class="mx-auto grid h-[34px] w-[34px] place-items-center rounded-full border-[3px] border-white bg-[#25a67f] text-[17px] font-bold leading-none text-white shadow-lg">+</div>
    <div class="mx-auto h-0 w-0 border-x-[6px] border-t-[10px] border-x-transparent border-t-[#1d8a68]"></div>
  </div>`;

const USER_ICON = `
  <div class="relative grid h-4 w-4 place-items-center">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-70"></span>
    <span class="relative inline-flex h-[15px] w-[15px] rounded-full border-2 border-white bg-sky-500 shadow"></span>
  </div>`;

const PLACE_ICON = `
  <div class="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-white bg-violet-600 text-[13px] text-white shadow-lg">⚲</div>`;

export default function HospitalMap({
  hospital,
  height = 420,
}: {
  hospital: HospitalLocation;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<L | null>(null);
  const userMarkerRef = useRef<any>(null);
  const linkLineRef = useRef<any>(null);
  const placeMarkerRef = useRef<any>(null);
  const accuracyRef = useRef<any>(null);

  const [status, setStatus] = useState<"locating" | "ready" | "denied" | "unsupported">(
    "locating",
  );
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isFull, setIsFull] = useState(false);

  const hospitalPoint: GeoPoint = useMemo(() => hospital.coords, [hospital.coords]);

  const placeUser = useCallback(
    (L: L, map: LeafletMap, point: GeoPoint, accuracy?: number) => {
      if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
      if (linkLineRef.current) map.removeLayer(linkLineRef.current);
      if (accuracyRef.current) map.removeLayer(accuracyRef.current);

      const userMarker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({ className: "", html: USER_ICON, iconSize: [16, 16], iconAnchor: [8, 8] }),
        zIndexOffset: 500,
      })
        .addTo(map)
        .bindPopup("You are here");
      userMarkerRef.current = userMarker;

      if (typeof accuracy === "number" && accuracy > 0) {
        accuracyRef.current = L.circle([point.lat, point.lng], {
          radius: accuracy,
          color: "#0ea5e9",
          weight: 1,
          fillColor: "#38bdf8",
          fillOpacity: 0.12,
        }).addTo(map);
      }

      const line = L.polyline(
        [
          [point.lat, point.lng],
          [hospitalPoint.lat, hospitalPoint.lng],
        ],
        { color: "#25a67f", weight: 2, dashArray: "5 7", opacity: 0.7 },
      ).addTo(map);
      linkLineRef.current = line;

      const bounds = L.latLngBounds([
        [point.lat, point.lng],
        [hospitalPoint.lat, hospitalPoint.lng],
      ]);
      map.fitBounds(bounds.pad(0.35), { maxZoom: 16 });
    },
    [hospitalPoint.lat, hospitalPoint.lng],
  );

  useEffect(() => {
    let cancelled = false;
    let geoWatch: number | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: [hospitalPoint.lat, hospitalPoint.lng],
        zoom: MAP_ZOOM,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      // Enable scroll zoom only after the user clicks the map (so page scroll works).
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());

      L.marker([hospitalPoint.lat, hospitalPoint.lng], {
        icon: L.divIcon({ className: "", html: HOSPITAL_ICON, iconSize: [34, 46], iconAnchor: [17, 46] }),
      })
        .addTo(map)
        .bindPopup(
          `<strong>${hospital.name}</strong><br/>${hospital.tagline}<br/>${hospital.address}, ${hospital.city}`,
        );

      setTimeout(() => map.invalidateSize(), 200);

      if (!("geolocation" in navigator)) {
        setStatus("unsupported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(point);
          setStatus("ready");
          setDistance(haversineKm(point, hospitalPoint));
          placeUser(L, map, point, pos.coords.accuracy);
        },
        () => setStatus("denied"),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
      );

      geoWatch = navigator.geolocation.watchPosition(
        (pos) => {
          if (cancelled) return;
          const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(point);
          setDistance(haversineKm(point, hospitalPoint));
        },
        () => undefined,
        { enableHighAccuracy: true, maximumAge: 15000 },
      );
    })();

    return () => {
      cancelled = true;
      if (geoWatch !== undefined) navigator.geolocation.clearWatch(geoWatch);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [hospital.city, hospital.name, hospital.tagline, hospital.address, hospitalPoint, placeUser]);

  // Debounced place search through our Nominatim proxy.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const near = position ? `&near=${position.lat},${position.lng}` : "";
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}${near}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.places ?? []);
        setShowResults(true);
      } catch {
        /* aborted or offline */
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query, position]);

  useEffect(() => {
    function onFsChange() {
      const active = document.fullscreenElement === wrapRef.current;
      setIsFull(active);
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function focusPlace(place: Place) {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    setSelectedPlace(place);
    setShowResults(false);
    setQuery(place.displayName.split(",")[0]);

    if (placeMarkerRef.current) map.removeLayer(placeMarkerRef.current);
    placeMarkerRef.current = L.marker([place.lat, place.lng], {
      icon: L.divIcon({ className: "", html: PLACE_ICON, iconSize: [26, 26], iconAnchor: [13, 13] }),
    })
      .addTo(map)
      .bindPopup(`<strong>${place.displayName.split(",")[0]}</strong><br/>${place.displayName}`)
      .openPopup();

    if (place.boundingBox) {
      const [s, n, w, e] = place.boundingBox;
      map.fitBounds(
        [
          [s, w],
          [n, e],
        ],
        { maxZoom: 16, padding: [24, 24] },
      );
    } else {
      map.flyTo([place.lat, place.lng], 15, { duration: 0.8 });
    }
  }

  function recenterToUser() {
    if (mapRef.current && position) {
      mapRef.current.flyTo([position.lat, position.lng], 16, { duration: 0.8 });
    }
  }

  function centerOnHospital() {
    if (mapRef.current) {
      mapRef.current.flyTo([hospitalPoint.lat, hospitalPoint.lng], MAP_ZOOM, {
        duration: 0.8,
      });
    }
  }

  function toggleFullscreen() {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (document.fullscreenElement === wrap) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      const request = wrap.requestFullscreen?.();
      if (request) request.catch(() => undefined);
    }
  }

  const directions = googleDirectionsUrl(position, hospitalPoint);
  const osm = position ? osmDirectionsUrl(position, hospitalPoint) : null;
  const placeDirections = selectedPlace
    ? googleDirectionsUrl(position, { lat: selectedPlace.lat, lng: selectedPlace.lng })
    : null;

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden border border-slate-200 bg-white shadow-sm ${
        isFull ? "flex h-screen w-screen flex-col rounded-none" : "rounded-2xl"
      }`}
    >
      <div className="relative flex-1" style={isFull ? undefined : { height }}>
        <div ref={containerRef} className="h-full w-full" style={isFull ? undefined : { height }} />

        {/* Legend + status */}
        <div className="pointer-events-none absolute left-3 top-[68px] z-[500] flex max-w-[230px] flex-col gap-1 rounded-xl bg-white/95 px-3 py-2 text-[10px] shadow-md backdrop-blur sm:top-3">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-[#25a67f]" /> Hospital
          </span>
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-sky-500" /> Your location
          </span>
          {selectedPlace && (
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-violet-600" /> Searched place
            </span>
          )}
          {status === "locating" && <span className="text-slate-500">Finding your location…</span>}
          {status === "denied" && (
            <span className="text-amber-600">
              Location blocked — allow it in your browser to see where you are.
            </span>
          )}
          {status === "unsupported" && (
            <span className="text-amber-600">Your browser does not support location.</span>
          )}
          {status === "ready" && distance !== null && (
            <span className="text-slate-500">{formatDistance(distance)} from the hospital</span>
          )}
        </div>

        {/* Search box */}
        <div className="absolute left-3 right-3 top-3 z-[550] mx-auto w-full max-w-[300px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur">
            <span className="text-slate-400">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              placeholder="Search a place or landmark…"
              className="w-full bg-transparent text-[12px] text-slate-700 outline-none"
            />
            {searching && <span className="text-[10px] text-slate-400">…</span>}
            {query && !searching && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {showResults && (
            <div className="mt-1 max-h-[230px] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
              {results.length === 0 ? (
                <p className="px-3 py-3 text-[11px] text-slate-400">No places found.</p>
              ) : (
                results.map((p, i) => (
                  <button
                    key={`${p.lat}-${p.lng}-${i}`}
                    type="button"
                    onClick={() => focusPlace(p)}
                    className="block w-full border-b border-slate-100 px-3 py-2 text-left last:border-0 hover:bg-slate-50"
                  >
                    <span className="block truncate text-[12px] font-semibold text-slate-700">
                      {p.displayName.split(",")[0]}
                    </span>
                    <span className="block truncate text-[10px] text-slate-400">
                      {p.displayName}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-3 right-3 z-[500] flex flex-col gap-2">
          <button
            type="button"
            onClick={recenterToUser}
            disabled={!position}
            className="rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-slate-600 shadow-md backdrop-blur disabled:opacity-50"
          >
            ◎ Where am I
          </button>
          <button
            type="button"
            onClick={centerOnHospital}
            className="rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-slate-600 shadow-md backdrop-blur"
          >
            ✚ Hospital
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-slate-600 shadow-md backdrop-blur"
          >
            {isFull ? "⤢ Exit" : "⤢ Fullscreen"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-slate-700">
            {selectedPlace
              ? selectedPlace.displayName
              : `${hospital.name} — ${hospital.tagline}`}
          </p>
          <p className="truncate text-[10px] text-slate-500">
            {selectedPlace
              ? "Directions open in your maps app"
              : `${hospital.address}, ${hospital.city}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={selectedPlace && placeDirections ? placeDirections : directions}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25a67f] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#218f6d]"
          >
            {selectedPlace ? "Directions to place ↗" : "Get directions ↗"}
          </a>
          {osm && !selectedPlace && (
            <a
              href={osm}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
            >
              Open in OpenStreetMap ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
