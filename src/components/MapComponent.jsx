import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, DEFAULT_CENTER, DEFAULT_ZOOM } from '../config/maps';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px'
};

function MapComponent({ center, markers = [] }) {
  const mapCenter = useMemo(() => center || DEFAULT_CENTER, [center]);

  // If no API key is set, show a placeholder
  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div style={{
        ...containerStyle,
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Please configure Google Maps API key</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Add your API key in src/config/maps.js
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        options={{
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#1e2746' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#b4b9c8' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0a0e27' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#141b2d' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            label={marker.label}
            icon={{
              url: marker.label === 'You' 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#6366f1"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </svg>
                `)
                : undefined
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;


