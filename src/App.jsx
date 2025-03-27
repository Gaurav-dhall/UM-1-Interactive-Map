import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from 'react-leaflet';
import SearchComponent from './components/SearchComponent';
import ClickableMap from './components/ClickableMap';

const App = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // ✅ Theme state
  const popupRef = useRef(null);

  // ✅ Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ✅ Handle theme toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // ✅ Save user preference
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLocationClick = () => {
    setIsTracking(true);
  };

  // ✅ Define Light & Dark Mode Tile Layers
  const tileLayerUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark Mode
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // Light Mode

  // 5 marked points on map of famous locations of India
  const locations = [
    { id: 1, name: "Taj Mahal, Agra", coords: [27.1750, 78.0419], info: "One of the Seven Wonders of the World." },
    { id: 2, name: "India Gate, Delhi", coords: [28.6129, 77.2295], info: "A war memorial for Indian soldiers." },
    { id: 3, name: "Gateway of India, Mumbai", coords: [18.9220, 72.8347], info: "Iconic landmark overlooking the Arabian Sea." },
    { id: 4, name: "Charminar, Hyderabad", coords: [17.3616, 78.4747], info: "Historic monument built in 1591." },
    { id: 5, name: "Amber Fort, Jaipur", coords: [26.9859, 75.8507], info: "A majestic palace with stunning architecture." }
  ];

  function LocationMarker() {
    const map = useMap();

    useEffect(() => {
      if (isTracking) {
        map.locate();
        map.on("locationfound", (e) => {
          setPosition(e.latlng);
          map.flyTo(e.latlng, 13);
          setIsTracking(false);
        });

        
      }
    }, [isTracking, map]);

     

    const applyPopupTheme = () => {
      if (popupRef.current) {
        const popupElement = popupRef.current._contentNode.parentElement;
        if (darkMode) {
          popupElement.style.backgroundColor = "oklch(0.21 0.034 264.665)";
          popupElement.style.color = "#ffffff"; // White text in dark mode
        } else {
          popupElement.style.backgroundColor = "#ffffff";
          popupElement.style.color = "#000000"; // Black text in light mode
        }
      }
    };
  

    return position ? (
      <Marker  position={position}>
        <Popup  ref={popupRef}  onOpen={applyPopupTheme}>You are here</Popup>
      </Marker>
    ) : null;
  }

  return (
    <div className={`relative ${darkMode ? "bg-gray-900 text-black" : "bg-white text-black"} h-screen w-full`}  >
      { /* ✅ Theme Toggle Button */}
      <div className='flex justify-between items-center'>
        <button
          onClick={toggleTheme}
          className={`absolute top-4  w-10 text-sm h-8 flex items-center justify-center right-7  z-1000 font-semibold  rounded-lg shadow-md transition-all duration-300 ease-in-out border ${
            darkMode
          ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
          : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* ✅ Find My Location Button */}
        <button
          onClick={handleLocationClick}
          className={`absolute bottom-4 right-7 w-10 h-10 text- z-1000 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out border ${
            darkMode
          ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
          : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
          }
          `}
        >
          📍
        </button>
        </div>

        {/* ✅ Map */}
      <MapContainer className="h-screen" center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true}>
        <TileLayer url={tileLayerUrl} />
        <SearchComponent darkMode={darkMode}/>
        <ClickableMap darkMode={darkMode} />

        {locations.map((place) => (
          <Marker key={place.id} position={place.coords}>
            <Popup>
              <b>{place.name}</b> <br /> {place.info}
            </Popup>
          </Marker>
        ))}

        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default App;
