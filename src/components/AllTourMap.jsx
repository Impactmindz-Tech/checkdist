import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PaymentPage from "@/page/user/Payment";
import moment from "moment";
import toast from "react-hot-toast";
import { setLocalStorage } from "@/utills/LocalStorageUtills";
import { DivIcon } from "leaflet";
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

const MapComponent = ({ selectPosition, setHeight, payment }) => {

  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [payemntDetails, setPayemntDetails] = useState(false);
  const [test, settest] = useState(null);
  const [disablePayment, setDisablePayment] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const safeSelectPosition = Array.isArray(selectPosition) ? selectPosition : [];

  const initialPosition = safeSelectPosition.length > 0 ? [safeSelectPosition[0].lat, safeSelectPosition[0].lon] : defaultPosition;

  const handleMarkerClick = (position) => {
 
  }
      

  const handleCurrentLocationClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setNewMarkerPosition({ lat: latitude, lon: longitude });
      const map = useMap();
      map.setView([latitude, longitude], 100, { animate: true });
    });
  };
  localStorage.setItem('r',test?.roomId);
  return (
    <>
      <MapContainer center={initialPosition} zoom={1} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer  checked name="Basic Map">
            <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eA3MBleCC9aTtUBJHL6C" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=eA3MBleCC9aTtUBJHL6C" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          </LayersControl.BaseLayer>
        </LayersControl>

        {safeSelectPosition.length > 0 &&
          safeSelectPosition.map((position, index) => (
            <Marker
              key={index}
              position={[position.lat, position.lon]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="position: relative; display: inline-block; text-align: center;">
    <img src="https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png" />
    <div style="position: absolute; top: -38px; left: 50%; transform: translateX(-50%); background-color: white; padding: 4px 10px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-size: 14px; font-weight: bold;">
        $${position?.ExpId?.AmountsperMinute}
        <!-- Arrow -->
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
    </div>
</div>

`
              })}
              eventHandlers={{
                click: () => handleMarkerClick(position),
              }}
            >
               <Popup>
                  <div>
                    <h3>Experience Details</h3>
                    <p><strong>Experience ID:</strong> {position?.ExpId?.ExperienceName}</p>
                    <p><strong>Amount per Minute:</strong> ${position?.ExpId?.AmountsperMinute}</p>
                    <p><strong>Description:</strong> {position?.ExpId?.about || "No description available"}</p>
                    <p><strong>Country:</strong> {position?.ExpId?.country || "No description available"}</p>
                    <p><strong>State:</strong> {position?.ExpId?.State || "No description available"}</p>
                    <p><strong>Rating:</strong> {position?.ExpId?.avgRating || 0.0}</p>
                  </div>
                </Popup>
            </Marker>
          ))}

        {newMarkerPosition && (
          <Marker position={[newMarkerPosition.lat, newMarkerPosition.lon]} icon={new DefaultIcon()}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        <RecentCenterView positions={safeSelectPosition} />
        <CurrentLocationButton onClick={handleCurrentLocationClick} />

        {!disablePayment && payemntDetails && payment && <PaymentPage payemntDetails={payemntDetails} setPayemntDetails={setPayemntDetails} selectPosition={selectPosition} tourDetails={test} />}
      </MapContainer>
    </>
  );
};

export default MapComponent;
