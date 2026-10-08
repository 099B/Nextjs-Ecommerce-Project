"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const locations = [
  { id: 1, name: "Shop Downtown", lat: 33.5731, lng: -7.5898 },
  { id: 2, name: "Shop Mall", lat: 33.585, lng: -7.632 },
  { id: 3, name: "Shop Marina", lat: 33.605, lng: -7.620 },
];

const MapComponent = () => {
  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer center={[33.58, -7.6]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
