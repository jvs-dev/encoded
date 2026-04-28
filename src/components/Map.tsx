import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const position: [number, number] = [-12.9348, -38.4037]; // Approximate coordinates for Avenida Luís Viana, Salvador

  return (
    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-white/10 relative z-0 mt-8">
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-black text-center">
              <strong>ENCODED</strong><br />
              Avenida Luís Viana, 6462<br />
              Paralela, Salvador - BA
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
