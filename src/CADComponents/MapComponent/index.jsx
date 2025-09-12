import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const InvalidateMapSize = () => {
    const map = useMap();
    useEffect(() => {
        const handleLoad = () => {
            map.invalidateSize(); // Recalculate size of the map once loaded
        };

        map.on('load', handleLoad); // Ensure invalidateSize runs after map loads

        return () => {
            map.off('load', handleLoad); // Clean up on component unmount
        };
    }, [map]);

    return null;
};

const MapComponent = ({ latitude, longitude }) => {
    const [locationName, setLocationName] = useState('');
    const [locationFound, setLocationFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const zoomLevel = 17;

    // Check if latitude and longitude are valid numeric values
    const isValidCoordinates = !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude));

    useEffect(() => {
        if (isValidCoordinates) {
            setIsLoading(true); // Set loading state initially

            // Simulate 2-second delay to show loading state
            setTimeout(() => {
                const fetchLocationName = async () => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        if (data.display_name) {
                            setLocationName(data.display_name);
                            setLocationFound(true);
                        } else {
                            setLocationFound(false); // No location found
                        }
                    } catch (error) {
                        console.error('Error fetching location name:', error);
                        setLocationFound(false); // Handle fetch error as location not found
                    } finally {
                        setIsLoading(false); // Stop loading after fetch attempt
                    }
                };

                fetchLocationName(); // Fetch location after the delay
            }, 500); // 2-second delay
        } else {
            setLocationName('');
            setLocationFound(false);
            setIsLoading(false); // Stop loading if invalid coordinates
        }
    }, [latitude, longitude, isValidCoordinates]);

    return (
        <div style={{ height: '380px', width: '100%', position: 'relative' }}>
            <MapContainer
                center={isValidCoordinates ? [latitude, longitude] : [0, 0]} // Fallback center if coordinates are invalid
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }} // Ensure map container takes full height
                whenCreated={(mapInstance) => {
                    // Trigger invalidateSize right after map is created
                    mapInstance.invalidateSize();
                }}
            >
                <InvalidateMapSize />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <ChangeView center={isValidCoordinates ? [latitude, longitude] : [0, 0]} zoom={zoomLevel} />
                {isValidCoordinates && locationFound && !isLoading && (
                    <Marker position={[latitude, longitude]}>
                        <Popup>
                            <div>
                                <strong>Location:</strong> {locationName} <br />
                                <strong>Coordinates:</strong> {latitude}, {longitude}
                            </div>
                        </Popup>
                    </Marker>
                )}
                {!isLoading && !locationFound && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '10px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            zIndex: 1000,
                        }}
                    >
                        Location not found
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;

// PropTypes definition
MapComponent.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

// Default props
MapComponent.defaultProps = {
  latitude: 0,
  longitude: 0
};
