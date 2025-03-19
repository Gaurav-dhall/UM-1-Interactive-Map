import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const SearchComponent = () => {
  const map = useMap(); // Access the map instance

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
     notFoundMessage: 'Sorry, that address could not be found.',
      provider: provider,
      style: "button",
      showMarker: true,
      autoClose: true,
    });

    map.addControl(searchControl); // ✅ Add search control to map

    return () => map.removeControl(searchControl); // ✅ Remove on unmount
  }, [map]); // ✅ Run effect only when map is available

  return null; // This component only adds search control, so no UI needed
};

export default SearchComponent;
