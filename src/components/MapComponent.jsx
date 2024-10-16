import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PaymentPage from "@/page/user/Payment";
import moment from "moment";
import toast from "react-hot-toast";
import { setLocalStorage } from "@/utills/LocalStorageUtills";

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
    // Calculate remaining time and check if it's less than 15 minutes
   
    if (position?.endTime) {
      const targetTime = moment(position.endTime, "YYYY-MM-DDTHH:mm:ss");
      const now = moment();
      const diff = targetTime.diff(now, "minutes");

      if (diff <= 2) {
        setDisablePayment(true);
        toast.error("Payment is disabled because less than 5 minutes remaining.");
      } else {
        setDisablePayment(false);
        setPayemntDetails(true);
        settest(position);
      }

     

      // Set the countdown value for display
      const duration = moment.duration(targetTime.diff(now));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      setCountdown(`${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`);
    } else {
      setPayemntDetails(true);
      settest(position);
    }
  };
      

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
              eventHandlers={{
                click: () => handleMarkerClick(position),
              }}
            >
              <Popup>{position?.ExpId?.ExperienceName}</Popup>
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
