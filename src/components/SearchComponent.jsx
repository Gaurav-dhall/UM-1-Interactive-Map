import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import axios from "axios";
import L from "leaflet";

const SearchComponent = ({ darkMode }) => {
  const map = useMap();
  const [polygonLayer, setPolygonLayer] = useState(null);
  const [searchControl, setSearchControl] = useState(null); // Store search control instance

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
        searchInput.style.backgroundColor = darkMode ? "#333" : "white"; // Dark mode background
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
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${e.location.label}&polygon_geojson=1`
        );
        console.log("Boundary response:", response.data);

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

  return null;
};

export default SearchComponent;
