import React from "react";
import ImageCarousel from "./ImageCarousel";
const PopupPanel = ({ placeData, setPlaceData,darkMode }) => {
  

  if (!placeData) return null;
  

    return (
      <div   
        className={`fixed top-40 left-0 h-[78vh] w-full p-6 transition-transform duration-300 ease-in-out shadow-lg z-10000 border-r
          ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"}
          md:w-[100%] md:h-[75vh] md:top-70 md:transition-transform md:duration-300 md:ease-in-out
          md:shadow-lg md:z-10000 md:border-r-0 md:border-b-0 md:rounded-t-lg md:rounded-b-none
         
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => setPlaceData(null)}
          className="absolute top-4 right-4 size-5 flex items-center justify-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
        >
          ✖
        </button>
           {/* Image Carousel */}
        {placeData.images && placeData.images.length > 0 && (
         <div className="mt-4">
         <h3 className="text-lg mb-2 font-semibold">📸 Images:</h3>
         <ImageCarousel images={placeData.images} />
       </div>
        )}
        {/* Location Title */}
        <h2 className="text-sm font-bold mt-5">{placeData.name}</h2>
  
        {/* Address Details */}
        {placeData.data && (
          <div className="mt-4 grid grid-cols-3 gap-1 text-xs">
            <p className="mb-1">🏙 <strong>City:</strong> {placeData.data.address.city_district || "N/A"}</p>
            <p className="mb-1">🏡 <strong>Village:</strong> {placeData.data.address.village || "N/A"}</p>
            <p>🌍 <strong>State:</strong> {placeData.data.address.state || "N/A"}</p>
            <p className="mb-1">📍 <strong>District:</strong> {placeData.data.address.state_district || "N/A"}</p>
            <p className="mb-1">🌎 <strong>Country:</strong> {placeData.data.address.country || "N/A"}</p>
            <p className="mb-1">📌 <strong>Coordinates:</strong> {placeData.lat}, {placeData.lng}</p>
          </div>
        )}
        {placeData.data.importance !== undefined && (
          <div className="">
            <h3 className="text-sm font-semibold">⭐ Importance:</h3>
            <div className="w-full h-4 bg-gray-300 rounded-md overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
                style={{ width: `${placeData.data.importance * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm">{(placeData.data.importance * 100).toFixed(2)}% relevance</p>
          </div>
        )}
  
       
  
        {/* OpenStreetMap Link */}
        <div className="mt-2">
          <a
            href={`http://www.openstreetmap.org/${placeData.data.osm_type}/${placeData.data.osm_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block   py-2 rounded-md text-white transition shadow-md"
          >
            🌐 View on OpenStreetMap
          </a>
        </div>
      </div>
    );
  };
  
  export default PopupPanel;
