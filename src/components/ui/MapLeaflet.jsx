"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapLeaflet({ cityData = [] }) {
    const [isReady, setIsReady] = useState(false);
    const mapKeyRef = useRef('map-' + Math.random().toString(36).slice(2));

    useEffect(() => {
        const t = setTimeout(() => setIsReady(true), 150);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!isReady) return;
        const leafletTiles = document.querySelectorAll('.leaflet-tile-pane');
        leafletTiles.forEach(pane => {
            pane.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
        });
    }, [isReady]);

    if (!isReady || typeof window === 'undefined') {
        return <div className="w-full h-full bg-slate-800 animate-pulse rounded-xl min-h-[300px]" />;
    }

    return (
        <MapContainer
            key={mapKeyRef.current}
            center={[22.5, 78.5]}
            zoom={4.5}
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(Array.isArray(cityData) ? cityData : []).map((data, index) => (
                <CircleMarker
                    key={index}
                    center={data.coordinates}
                    radius={8}
                    pathOptions={{ color: data.color, fillColor: data.color, fillOpacity: 0.8, weight: 2 }}
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent className="custom-tooltip">
                        <div className="text-center text-xs font-bold text-slate-800">
                            {data.city} <br />
                            <span style={{ color: data.color }}>{data.tooltipText}</span>
                        </div>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
