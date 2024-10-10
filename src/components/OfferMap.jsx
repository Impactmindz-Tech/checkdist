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
    this.options.iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
    this.options.iconUrl = "https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png";
    this.options.shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";
  }
}

// Apply the extended default icon options
L.Icon.Default.prototype = new DefaultIcon();
L.Icon.Default.mergeOptions({
  iconUrl: 'https://res.cloudinary.com/dzmy6os8w/image/upload/v1728554690/marker-icon_q27bnu.png'
  
});

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

const OfferMap = ({ selectPosition, setHeight, payment,data }) => {

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

      if (diff <= 15) {
        setDisablePayment(true);
        toast.error("Payment is disabled because less than 15 minutes remaining.");
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
      <MapContainer center={initialPosition} zoom={5} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Basic Map">
            <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eA3MBleCC9aTtUBJHL6C" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satellite View">
            <TileLayer url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=eA3MBleCC9aTtUBJHL6C" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          </LayersControl.BaseLayer>
        </LayersControl>

        {data&&
          
            <Marker
           
              position={[data.lat, data.lng]}
        
            >
           
            </Marker>
          }

        {data && (
          <Marker position={[data.lat, data.lng]} icon={new DefaultIcon()}>
            <Popup>User Location</Popup>
          </Marker>
        )}

        <RecentCenterView positions={safeSelectPosition} />
        <CurrentLocationButton onClick={handleCurrentLocationClick} />

        {!disablePayment && payemntDetails && payment && <PaymentPage payemntDetails={payemntDetails} setPayemntDetails={setPayemntDetails} selectPosition={selectPosition} tourDetails={test} />}
      </MapContainer>
    </>
  );
};

export default OfferMap;
