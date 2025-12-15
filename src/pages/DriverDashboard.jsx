import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaWrench, FaSignOutAlt, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import MapComponent from '../components/MapComponent';
import './Dashboard.css';

function DriverDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [nearbyGarages, setNearbyGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyGarages();
      listenToActiveRequest();
    }
  }, [location]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const fetchNearbyGarages = async () => {
    try {
      const q = query(
        collection(db, 'garages'),
        where('isAvailable', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const garages = [];
      
      querySnapshot.forEach((doc) => {
        const garage = { id: doc.id, ...doc.data() };
        if (garage.location) {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            garage.location.lat,
            garage.location.lng
          );
          garage.distance = distance;
          garages.push(garage);
        }
      });

      garages.sort((a, b) => a.distance - b.distance);
      setNearbyGarages(garages.slice(0, 10));
    } catch (err) {
      setError('Failed to fetch garages');
    }
  };

  const listenToActiveRequest = () => {
    const q = query(
      collection(db, 'requests'),
      where('driverId', '==', user.uid),
      where('status', 'in', ['pending', 'accepted', 'on_the_way'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setActiveRequest(request);
      } else {
        setActiveRequest(null);
      }
    });

    return unsubscribe;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sendRequest = async (garage) => {
    if (!location) {
      setError('Location not available');
      return;
    }

    try {
      await addDoc(collection(db, 'requests'), {
        driverId: user.uid,
        driverName: user.displayName || 'Driver',
        driverLocation: location,
        garageId: garage.id,
        garageName: garage.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
        description: ''
      });
      setSelectedGarage(null);
    } catch (err) {
      setError('Failed to send request');
    }
  };

  const cancelRequest = async () => {
    if (!activeRequest) return;

    try {
      await updateDoc(doc(db, 'requests', activeRequest.id), {
        status: 'cancelled'
      });
    } catch (err) {
      setError('Failed to cancel request');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <FaWrench className="header-logo" />
              <h1>RepairME</h1>
            </div>
            <div className="header-right">
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="btn btn-secondary">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {activeRequest ? (
            <div className="active-request-card card">
              <h2>Active Request</h2>
              <div className="request-info">
                <p><strong>Garage:</strong> {activeRequest.garageName}</p>
                <p><strong>Status:</strong> 
                  <span className={`badge badge-${activeRequest.status === 'accepted' ? 'success' : 'warning'}`}>
                    {activeRequest.status.replace('_', ' ').toUpperCase()}
                  </span>
                </p>
                {activeRequest.garageLocation && (
                  <div className="map-container-small">
                    <MapComponent
                      center={location}
                      markers={[
                        { position: location, label: 'You' },
                        { position: activeRequest.garageLocation, label: 'Garage' }
                      ]}
                    />
                  </div>
                )}
                <button onClick={cancelRequest} className="btn btn-danger">
                  Cancel Request
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="dashboard-grid">
                <div className="dashboard-card card">
                  <h2>Your Location</h2>
                  {location ? (
                    <div className="location-info">
                      <FaMapMarkerAlt className="location-icon" />
                      <p>Lat: {location.lat.toFixed(4)}</p>
                      <p>Lng: {location.lng.toFixed(4)}</p>
                      <button onClick={getCurrentLocation} className="btn btn-secondary btn-sm">
                        Refresh Location
                      </button>
                    </div>
                  ) : (
                    <p>Location not available</p>
                  )}
                </div>

                <div className="map-container card">
                  <h2>Nearby Garages</h2>
                  {location && (
                    <MapComponent
                      center={location}
                      markers={nearbyGarages.map(garage => ({
                        position: garage.location,
                        label: garage.name
                      }))}
                    />
                  )}
                </div>
              </div>

              <div className="garages-list card">
                <h2>Available Garages</h2>
                {nearbyGarages.length === 0 ? (
                  <p>No nearby garages found</p>
                ) : (
                  <div className="garages-grid">
                    {nearbyGarages.map((garage) => (
                      <div key={garage.id} className="garage-card">
                        <h3>{garage.name}</h3>
                        <p className="garage-distance">
                          <FaMapMarkerAlt /> {garage.distance.toFixed(2)} km away
                        </p>
                        {garage.phone && <p>📞 {garage.phone}</p>}
                        {garage.rating > 0 && (
                          <p className="garage-rating">⭐ {garage.rating.toFixed(1)}</p>
                        )}
                        <button
                          onClick={() => sendRequest(garage)}
                          className="btn btn-primary"
                        >
                          Request Help
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;

