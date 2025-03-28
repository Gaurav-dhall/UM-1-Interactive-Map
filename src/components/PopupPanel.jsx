import React from "react";
import ImageCarousel from "./ImageCarousel";
const PopupPanel = ({ placeData, setPlaceData,darkMode }) => {
  

  if (!placeData) {
    // sendDataToParent(false)
    return null;
  }
  

    return (
      <>  
      
      
          <div   
        className={`fixed top-[40%] left-0 h-[60%] w-full p-6 transition-transform duration-300 ease-in-out shadow-lg z-10000 border-r
          ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"}
         
          md:w-[100%] md:h-[80vh] md:top-[30%] md:transition-transform md:duration-300 md:ease-in-out
          md:shadow-lg md:z-10000 md:border-r-0 md:border-b-0 md:rounded-t-lg md:rounded-b-none
          lg:w-[40%] lg:h-screen lg:top-0 lg:transition-transform lg:duration-300 lg:ease-in-out
          lg:shadow-lg lg:z-10000 lg:border-r-0 lg:border-b-0 lg:rounded-t-lg lg:rounded-b-none

         
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setPlaceData(null);   // Panel close kar raha hai
             // ✅ Parent ko update kar raha hai
          }}
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
        <h2 className="text-sm md:text-2xl lg:text-2xl font-bold mt-5">{placeData.name}</h2>
  
       
          {placeData.data && (
            <div className="mt-4 grid md:text-xl lg:text-lg grid-cols-3 gap-1 text-xs">
              <p className="mb-1">🏙 City: {placeData.data.address.city_district || "N/A"}</p>
              <p className="mb-1">🏡Village: {placeData.data.address.village || "N/A"}</p>
              <p>🌍 <strong>State:</strong> {placeData.data.address.state || "N/A"}</p>
              <p className="mb-1">📍District: {placeData.data.address.state_district || "N/A"}</p>
              <p className="mb-1">🌎Country: {placeData.data.address.country || "N/A"}</p>
              <p className="mb-1">📌Coordinates: {placeData.lat.toFixed(4)}, {placeData.lng.toFixed(4)}</p>
            </div>
          )}
          {placeData.data.importance !== undefined && (
            <div className="">
              <h3 className="text-sm md:text-xl font-semibold">⭐ Importance:</h3>
              <div className="w-full h-4 bg-gray-300 rounded-md overflow-hidden relative">
                <div
            className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
            style={{ width: `${placeData.data.importance * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 md:text-lg text-sm">{(placeData.data.importance * 100).toFixed(2)}% relevance</p>
            </div>
          )}
          
               
          
          {/* OpenStreetMap Link */}
        <div className="mt-2">
          <a
            href={`http://www.openstreetmap.org/${placeData.data.osm_type}/${placeData.data.osm_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block md:text-sm   py-2 rounded-md text-white transition shadow-md"
          >
            🌐 View on OpenStreetMap
          </a>
        </div>
      </div>
      </>
    );
  };
  
  export default PopupPanel;
