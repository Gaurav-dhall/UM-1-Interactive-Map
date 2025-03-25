import React, { useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import axios from "axios";

const ClickableMap = () => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState("Fetching location...");

  // Capture click events on the map
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setClickedLocation([lat, lng]);
      setLocationInfo("Fetching location..."); // Show loading text before API response

      try {
        // Reverse Geocoding API (Nominatim - OpenStreetMap)
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        console.log("Location Info:", response.data);
        setLocationInfo(response.data.display_name || "No information available");
      } catch (error) {
        console.error("Error fetching location info:", error);
        setLocationInfo("Could not fetch location details.");
      }
    },
  });

  return clickedLocation ? (
    <Marker position={clickedLocation}>
      <Popup>
        <b>Location Info:</b> <br /> {locationInfo}
      </Popup>
    </Marker>
  ) : null;
};

export default ClickableMap;
