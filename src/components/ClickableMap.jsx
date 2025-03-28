import React, { useState, useRef, useEffect } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import PopupPanel from "./PopupPanel"; // ✅ Importing PopupPanel component

const UNSPLASH_ACCESS_KEY = "sac-RkjymWf8lVvO5GTahUNI7O8OmyNJV6vCnBEnF7I"; // ⬅️ Unsplash API Key

const ClickableMap = ({ darkMode }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState("Fetching location...");
  const [placeData, setPlaceData] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // ✅ Panel visibility state
  
  const markerRef = useRef(null);

  // ✅ Map Click Event: Add Marker & Fetch Location
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setClickedLocation([lat, lng]);
      setLocationInfo("Fetching location...");
      setIsPanelOpen(false); // ✅ Close panel on new click

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        setLocationInfo(response.data.display_name || "No information available");
      } catch (error) {
        console.error("Error fetching location info:", error);
        setLocationInfo("Could not fetch location details.");
      }

      // ✅ Open Popup Automatically
      setTimeout(() => {
        if (markerRef.current) {
          markerRef.current.openPopup();
        }
      }, 100);
    },
  });

  useEffect(() => {
    const popupElements = document.querySelectorAll(".leaflet-popup-content-wrapper");
    popupElements.forEach((popup) => {
      if (darkMode) {
        popup.style.backgroundColor = "oklch(0.278 0.033 256.848)";
        popup.style.color = "#ffffff"; // White text in dark mode
      } else {
        popup.style.backgroundColor = "#ffffff";
        popup.style.color = "#000000"; // Black text in light mode
      }
    });
  }, [darkMode, clickedLocation]);

  // ✅ Function to Fetch & Set Side Panel Data + Images from Unsplash
  const handleKnowMoreClick = async () => {
    if (!clickedLocation) return;

    const [lat, lng] = clickedLocation;
    console.log("🌍 Fetching Side Panel Data for:", lat, lng);

    try {
      // 🔹 Fetch Location Name
      const locationResponse = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const locationName = locationResponse.data.display_name || "Unknown Place";

      // 🔹 Fetch Images from Unsplash
      const imageResponse = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(locationName)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5`
      );

      const images = imageResponse.data.results.map((img) => img.urls.small);

      setPlaceData({
        lat,
        lng,
        name: locationName,
        data: locationResponse.data,
        images, // ✅ Adding images array to placeData
      });

      console.log("📌 Side Panel Data is being set...");
    } catch (error) {
      console.error("❌ Error fetching side panel info:", error);
    }
  };

  // ✅ Open panel when `placeData` updates
  useEffect(() => {
    if (placeData) {
      setIsPanelOpen(true);
     // ✅ Send data to parent component
      console.log("✅ Side Panel Opened with data:", placeData);
    }
  }, [placeData]);

  return (
    <>
      {clickedLocation && (
        <Marker position={clickedLocation} ref={markerRef}>
          <Popup autoClose={false}>
            <div>
              <b>📍 Location Info:</b> <br /> {locationInfo}
              <br />
              
                      {locationInfo !== "No information available" && (
                      <button
                        onClick={handleKnowMoreClick}
                        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-600 transition"
                      >
                        Know More
                      </button>
                      )}
                    </div>
                    </Popup>
                  </Marker>
                  )}

                  {/* ✅ Show PopupPanel when isPanelOpen is true */}
      {isPanelOpen && (
        <PopupPanel  placeData={placeData} setPlaceData={setPlaceData} darkMode={darkMode} />
      )}
    </>
  );
};

export default ClickableMap;
