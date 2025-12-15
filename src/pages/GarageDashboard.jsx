import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaWrench, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import MapComponent from '../components/MapComponent';
import './Dashboard.css';

function GarageDashboard() {
  const { user, logout } = useAuth();
  const [garageData, setGarageData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGarageData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (garageData) {
      listenToRequests();
    }
  }, [garageData]);

  useEffect(() => {
    if (location && garageData) {
      updateGarageLocation();
    }
  }, [location]);

  const fetchGarageData = async () => {
    try {
      const docRef = doc(db, 'garages', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGarageData(docSnap.data());
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching garage data:', err);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error('Error getting location:', err);
        }
      );
    }
  };

  const updateGarageLocation = async () => {
    try {
      await updateDoc(doc(db, 'garages', user.uid), {
        location: location
      });
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const listenToRequests = () => {
    const q = query(
      collection(db, 'requests'),
      where('garageId', '==', user.uid),
      where('status', 'in', ['pending', 'accepted', 'on_the_way'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsList = [];
      snapshot.forEach((doc) => {
        requestsList.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requestsList);
      
      const active = requestsList.find(r => r.status !== 'pending');
      setActiveRequest(active || null);
    });

    return unsubscribe;
  };

  const handleRequest = async (requestId, action) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      await updateDoc(doc(db, 'requests', requestId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      if (action === 'accept' && location) {
        await updateDoc(doc(db, 'requests', requestId), {
          garageLocation: location
        });
      }
    } catch (err) {
      console.error('Error handling request:', err);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!activeRequest) return;

    try {
      await updateDoc(doc(db, 'requests', activeRequest.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const toggleAvailability = async () => {
    try {
      await updateDoc(doc(db, 'garages', user.uid), {
        isAvailable: !garageData.isAvailable
      });
    } catch (err) {
      console.error('Error toggling availability:', err);
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
              <h1>RepairME Garage</h1>
            </div>
            <div className="header-right">
              <span className="user-email">{garageData?.name || user.email}</span>
              <button onClick={logout} className="btn btn-secondary">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-card card">
              <h2>Garage Status</h2>
              <div className="status-controls">
                <p>
                  Status: 
                  <span className={`badge ${garageData?.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                    {garageData?.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </p>
                <button
                  onClick={toggleAvailability}
                  className={`btn ${garageData?.isAvailable ? 'btn-danger' : 'btn-success'}`}
                >
                  {garageData?.isAvailable ? 'Set Busy' : 'Set Available'}
                </button>
              </div>
              {location && (
                <div className="location-info">
                  <FaMapMarkerAlt className="location-icon" />
                  <p>Your Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                </div>
              )}
            </div>

            {activeRequest && (
              <div className="active-request-card card">
                <h2>Active Request</h2>
                <div className="request-info">
                  <p><strong>Driver:</strong> {activeRequest.driverName}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge badge-${activeRequest.status === 'accepted' ? 'success' : 'warning'}`}>
                      {activeRequest.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </p>
                  {activeRequest.driverLocation && (
                    <div className="map-container-small">
                      <MapComponent
                        center={activeRequest.driverLocation}
                        markers={[
                          { position: activeRequest.driverLocation, label: 'Driver' },
                          { position: location, label: 'You' }
                        ]}
                      />
                    </div>
                  )}
                  <div className="status-buttons">
                    {activeRequest.status === 'accepted' && (
                      <button
                        onClick={() => updateStatus('on_the_way')}
                        className="btn btn-primary"
                      >
                        On The Way
                      </button>
                    )}
                    {activeRequest.status === 'on_the_way' && (
                      <button
                        onClick={() => updateStatus('completed')}
                        className="btn btn-success"
                      >
                        <FaCheckCircle /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="requests-list card">
            <h2>New Requests</h2>
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <p>No new requests</p>
            ) : (
              <div className="requests-grid">
                {requests
                  .filter(r => r.status === 'pending')
                  .map((request) => (
                    <div key={request.id} className="request-card">
                      <h3>{request.driverName}</h3>
                      <p className="request-time">
                        <FaClock /> {new Date(request.createdAt).toLocaleString()}
                      </p>
                      {request.driverLocation && (
                        <p className="request-location">
                          <FaMapMarkerAlt /> {request.driverLocation.lat.toFixed(4)}, {request.driverLocation.lng.toFixed(4)}
                        </p>
                      )}
                      <div className="request-actions">
                        <button
                          onClick={() => handleRequest(request.id, 'accept')}
                          className="btn btn-success"
                        >
                          <FaCheckCircle /> Accept
                        </button>
                        <button
                          onClick={() => handleRequest(request.id, 'reject')}
                          className="btn btn-danger"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default GarageDashboard;

