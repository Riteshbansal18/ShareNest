import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// City center coordinates
const CITY_COORDS = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Pune: [18.5204, 73.8567],
  Chennai: [13.0827, 80.2707],
};

// Custom price marker
const createPriceIcon = (price) => L.divIcon({
  className: '',
  html: `<div style="background:#003466;color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">₹${(price/1000).toFixed(0)}K</div>`,
  iconAnchor: [20, 10],
});

// Auto-fit map to markers
function FitBounds({ properties }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    const coords = properties
      .filter(p => p.coordinates?.lat && p.coordinates?.lng)
      .map(p => [p.coordinates.lat, p.coordinates.lng]);
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 13 });
    }
  }, [properties]);
  return null;
}

const getImg = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300';
  return img.startsWith('http') ? img : `http://localhost:5000${img}`;
};

export default function PropertyMap({ properties, selectedCity }) {
  // Assign approximate coordinates to properties that don't have them
  const propertiesWithCoords = properties.map((p, i) => {
    if (p.coordinates?.lat && p.coordinates?.lng) return p;
    const base = CITY_COORDS[p.city] || CITY_COORDS['Mumbai'];
    // Spread markers slightly so they don't overlap
    const offset = 0.02;
    return {
      ...p,
      coordinates: {
        lat: base[0] + (Math.sin(i * 1.5) * offset),
        lng: base[1] + (Math.cos(i * 1.5) * offset),
      }
    };
  });

  const center = selectedCity && CITY_COORDS[selectedCity]
    ? CITY_COORDS[selectedCity]
    : [20.5937, 78.9629]; // India center

  return (
    <MapContainer center={center} zoom={selectedCity ? 12 : 5} style={{ height: '100%', width: '100%', borderRadius: '12px' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds properties={propertiesWithCoords} />
      {propertiesWithCoords.map(p => (
        <Marker key={p._id} position={[p.coordinates.lat, p.coordinates.lng]} icon={createPriceIcon(p.price)}>
          <Popup maxWidth={240} className="property-popup">
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 200 }}>
              <img src={getImg(p.images?.[0])} alt={p.title}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{p.title}</p>
              <p style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>📍 {p.neighborhood || p.city}, {p.city}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 800, color: '#003466', fontSize: 14 }}>₹{p.price?.toLocaleString('en-IN')}/mo</span>
                {p.verified && <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20 }}>✓ Verified</span>}
              </div>
              <a href={`/property-details/${p._id}`}
                style={{ display: 'block', textAlign: 'center', background: '#003466', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                View Details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
