"use client";

import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// TopoJSON strictly for India mapping
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

function IndiaMapComponent({ cityData }) {
    return (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000, center: [80.5, 23.5] }}
            style={{ width: "100%", height: "100%" }}
        >
            <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#1e293b"
                            stroke="#334155"
                            strokeWidth={1}
                            style={{
                                default: { outline: "none" },
                                hover: { fill: "#334155", outline: "none" },
                                pressed: { outline: "none" }
                            }}
                        />
                    ))
                }
            </Geographies>
            {cityData.map(({ city, coordinates, color, tooltipText }) => (
                <Marker key={city} coordinates={coordinates}>
                    <circle r={6} fill={color} stroke="#0f172a" strokeWidth={2} />
                    <text textAnchor="middle" y={-10} style={{ fontFamily: "ui-sans-serif, system-ui", fill: "#e2e8f0", fontSize: "11px", fontWeight: "600", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        {city}
                    </text>
                    {tooltipText && (
                        <title>{tooltipText}</title>
                    )}
                </Marker>
            ))}
        </ComposableMap>
    );
}

export const IndiaMap = memo(IndiaMapComponent);
