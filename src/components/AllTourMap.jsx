import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Extend the L.Icon.Default class to set the default options
class DefaultIcon extends L.Icon.Default {
  constructor() {
    super();
    this.options.iconRetinaUrl = "https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png";
    this.options.iconUrl = "https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png";
    this.options.shadowUrl = "https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png";
  }
}
L.Icon.Default.mergeOptions({
  iconUrl: 'https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png'
});

// Apply the extended default icon options
L.Icon.Default.prototype = new DefaultIcon();

const defaultPosition = [30.7333, 76.7794]; // Default position in Chandigarh

const RecentCenterView = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions && Array.isArray(positions) && positions.length > 0) {
      const lastPosition = positions[positions.length - 1];
      map.setView([lastPosition.lat, lastPosition.lon], 16, {
        animate: true,
      });
    }
  }, [positions, map]);

  return null;
};

const CurrentLocationButton = ({ onClick }) => {
  const map = useMapEvents({
    click() {
      onClick();
    },
  });
 
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        backgroundColor: "#fff",
        padding: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        zIndex: 1000,
      }}
      onClick={map.click}
    >
      Show Current Location
    </div>
  );
};

const AllTourMap = ({ selectPosition }) => {

  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null); // New state to track the selected experience

  const safeSelectPosition = Array.isArray(selectPosition) ? selectPosition : [];
  const initialPosition = safeSelectPosition.length > 0 ? [safeSelectPosition[0].lat, safeSelectPosition[0].lon] : defaultPosition;

  const handleCurrentLocationClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setNewMarkerPosition({ lat: latitude, lon: longitude });
      const map = useMap();
      map.setView([latitude, longitude], 100, { animate: true });
    });
  };

  const handleMarkerClick = (position) => {
    setSelectedExperience(position); // Store the selected experience data when the marker popup is clicked
  };

  return (
    <>
      <MapContainer center={initialPosition} zoom={1} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Basic Map">
            <TileLayer
              url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eA3MBleCC9aTtUBJHL6C"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=eA3MBleCC9aTtUBJHL6C"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {safeSelectPosition.length > 0 &&
          safeSelectPosition.map((position, index) => (
            <Marker
              key={index}
              position={[position.lat, position.lon]}
              eventHandlers={{
                click: () => handleMarkerClick(position), // Call when marker is clicked
              }}
              ref={(marker) => marker && marker.openPopup()}
            >
              <Popup>
                <div onClick={() => handleMarkerClick(position)}>
                  {`$ ${position?.ExpId?.AmountsperMinute}`} 
                  <br />
                  <small>Click for more details</small>
                </div>
              </Popup>
            </Marker>
          ))}

        {newMarkerPosition && (
          <Marker
            ref={(marker) => marker && marker.openPopup()}
            position={[newMarkerPosition.lat, newMarkerPosition.lon]}
            icon={new DefaultIcon()}
          >
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {/* Display detailed popup if selectedExperience is set */}
        {selectedExperience && (
          <Marker
            position={[selectedExperience.lat, selectedExperience.lon]}
            icon={new DefaultIcon()}
            ref={(marker) => marker && marker.openPopup()}
          >
            <Popup>
              <div>
                <h3>Experience Details</h3>
                <p><strong>Experience ID:</strong> {selectedExperience?.ExpId?.ExperienceName}</p>
                <p><strong>Amount per Minute:</strong> ${selectedExperience?.ExpId?.AmountsperMinute}</p>
                <p><strong>Description:</strong> {selectedExperience?.ExpId?.about || "No description available"}</p>
                <p><strong>Country:</strong> {selectedExperience?.ExpId?.country || "No description available"}</p>
                <p><strong>State:</strong> {selectedExperience?.ExpId?.State || "No description available"}</p>
                <p><strong>Rating:</strong>{selectedExperience?.ExpId?.avgRating || 0.0}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <RecentCenterView positions={safeSelectPosition} />
        <CurrentLocationButton onClick={handleCurrentLocationClick} />
      </MapContainer>
    </>
  );
};

export default AllTourMap;
