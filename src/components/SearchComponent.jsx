import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import axios from "axios";
import L from "leaflet";
import PopupPanel from "./PopupPanel";

const UNSPLASH_ACCESS_KEY = "sac-RkjymWf8lVvO5GTahUNI7O8OmyNJV6vCnBEnF7I";

const SearchComponent = ({ darkMode }) => {
  const map = useMap();
  const [polygonLayer, setPolygonLayer] = useState(null);
  const [searchControl, setSearchControl] = useState(null); // Store search control instance
  const [placeData, setPlaceData] = useState(null);
  


  const fetchImagesFromUnsplash = async (query) => {
    try {
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query,
          client_id: UNSPLASH_ACCESS_KEY,  // ✅ API Key
          per_page: 5,  // ✅ 5 images fetch karne ke liye
        },
      });
  
      return response.data.results.map((photo) => photo.urls.small); // ✅ Array of images return karega
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

    // ✅ Fetch detailed address using Reverse Geocoding API
    const fetchReverseGeocodeData = async (lat, lng) => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat,
            lon: lng,
            format: "json",
          },
        });
      
  
        return response.data || {}; // ✅ Return address object
      } catch (error) {
        console.error("Error fetching reverse geocode data:", error);
        return {};
      }
    };
  

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const control = new GeoSearchControl({
      provider: provider,
      style: "button",
      showMarker: true,
      autoClose: true,
      notFoundMessage: "Sorry, that address could not be found.",
    });

    if (searchControl) {
      try {
        map.removeControl(searchControl);
      } catch (error) {
        console.warn("Error removing search control:", error);
      }
    }
    
    setSearchControl(control);
    map.addControl(control);

    setTimeout(() => {
      const searchInput = document.querySelector(".leaflet-control-geosearch form input");
      if (searchInput) {
        searchInput.style.backgroundColor = darkMode ? "oklch(0.278 0.033 256.848)" : "white"; // Dark mode background
        searchInput.style.color = darkMode ? "#fff" : "#000"; // Dark mode text color
        searchInput.style.border = darkMode ? "1px solid #666" : "1px solid #ccc"; // Border
        searchInput.style.outline = "none"; // Removes the default focus outline
        searchInput.style.padding = "8px"; // Better spacing
        searchInput.style.borderRadius = "5px"; // Rounded corners
      }
    }, 100); // Wait for the control to be added to the DOM

    return () => {
      if (map && control) {
        try {
          map.removeControl(control);
        } catch (error) {
          console.warn("Error removing search control:", error);
        }
      }
    };
  }, [map, darkMode]); // ✅ Re-run when `darkMode` changes

  // 🔥 Handle polygon drawing based on search
  useEffect(() => {
    const handleLocationFound = async (e) => {
      const { x: lng, y: lat } = e.location;

      try {
        const [imageUrls, reverseGeocodeData] = await Promise.all([
          fetchImagesFromUnsplash(e.location.label),
          fetchReverseGeocodeData(lat, lng),
        ]);

        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${e.location.label}&polygon_geojson=1`
        );

        if (response.data.length > 0) {
          
          const geojsonData = response.data[0].geojson;

          if (polygonLayer) {
            map.removeLayer(polygonLayer);
          }

          const newPolygon = L.geoJSON(geojsonData, {
            style: {
              color: darkMode ? "#FFEB3B" : "#D32F2F",
              weight: 2,
              dashArray: "5, 5",
              fillColor: darkMode ? "#FFF59D" : "#FFCDD2",
              fillOpacity: 0.2,
            },
          }).addTo(map);

          setPolygonLayer(newPolygon);
          map.fitBounds(newPolygon.getBounds());

          setPlaceData({
            name: e.location.label,
            images: imageUrls,
            lat,
            lng,
            data: reverseGeocodeData, // ✅ Reverse Geocoding Data
          });
        
          
        }
      } catch (error) {
        console.error("Error fetching boundary:", error);
      }
    };

    map.on("geosearch/showlocation", handleLocationFound);

    return () => {
      map.off("geosearch/showlocation", handleLocationFound);
      if (polygonLayer) {
        map.removeLayer(polygonLayer);
      }
    };
  }, [map]);

  

  useEffect(() => {
    if (polygonLayer) {
      polygonLayer.setStyle({
        color: darkMode ? "#FFEB3B" : "#D32F2F",
        fillColor: darkMode ? "#FFF59D" : "#FFCDD2",
      });
    }
  }, [darkMode]);



  return (
    <>
      {/* 🔥 PopupPanel ko return kiya bina baki logic affect kiye */}
      <PopupPanel placeData={placeData} setPlaceData={setPlaceData}  darkMode={darkMode}  />
    </>
  );
};

export default SearchComponent;
