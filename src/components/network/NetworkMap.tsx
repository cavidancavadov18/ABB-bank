"use client";

import { useEffect, useRef } from "react";
import type { NetworkBranch } from "@/lib/data/network";

type Props = {
  branches: NetworkBranch[];
  selected: NetworkBranch | null;
  userPos: { lat: number; lng: number } | null;
  onSelect: (b: NetworkBranch) => void;
};

export function NetworkMap({ branches, selected, userPos, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<number, import("leaflet").Marker>>(new Map());
  const userMarkerRef = useRef<import("leaflet").CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([40.4093, 49.8671], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapRef.current = map;

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;border-radius:50%;background:#1b63ed;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      branches.forEach((b) => {
        if (b.lat == null || b.lng == null) return;
        const m = L.marker([b.lat, b.lng], { icon })
          .addTo(map)
          .bindTooltip(b.title, { direction: "top", offset: [0, -12] });
        m.on("click", () => onSelectRef.current(b));
        markersRef.current.set(b.id, m);
      });
    }

    void init();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      userMarkerRef.current = null;
    };
  }, [branches]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected?.lat || !selected?.lng) return;
    map.flyTo([selected.lat, selected.lng], 14, { duration: 0.6 });
    const m = markersRef.current.get(selected.id);
    m?.openTooltip();
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    async function placeUser() {
      if (!userPos || !mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
      } else {
        userMarkerRef.current = L.circleMarker([userPos.lat, userPos.lng], {
          radius: 8,
          color: "#fff",
          weight: 3,
          fillColor: "#1b63ed",
          fillOpacity: 1,
        }).addTo(mapRef.current);
      }
    }
    void placeUser();
    return () => {
      cancelled = true;
    };
  }, [userPos]);

  return <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />;
}
