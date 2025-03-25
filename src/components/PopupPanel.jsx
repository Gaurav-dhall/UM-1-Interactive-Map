import React from "react";

const PopupPanel = ({ placeData, setPlaceData,darkMode }) => {
  if (!placeData) return null;
  console.log("Place Data:", placeData);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[40%] ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg p-4 transition-transform duration-300 ease-in-out 
      border-r ${darkMode ? "border-gray-700" : "border-gray-300"} overflow-y-auto z-10000`}
    >
      {/* 🔥 Close Button */}
      <button
        onClick={() => setPlaceData(null)}
        className={`absolute top-4 right-4 ${
          darkMode ? "bg-red-600" : "bg-red-500"
        } text-white px-3 py-1 rounded-full`}
      >
        ✖ Close
      </button>

      {/* 🔥 Location Name */}
      <h2 className="text-2xl font-bold">{placeData.name}</h2>

      {/* 🏙 Address Details */}
      {placeData.data && (
        <div className="mt-2">
          <p>🏙 <strong>City:</strong> {placeData.data.address.city_district || "N/A"}</p>
          <p>🏡 <strong>Village:</strong> {placeData.data.address.village || "N/A"}</p>
          <p>🌍 <strong>State:</strong> {placeData.data.address.state || "N/A"}</p>
          <p>📍 <strong>District:</strong> {placeData.data.address.state_district || "N/A"}</p>
          <p>🌎 <strong>Country:</strong> {placeData.data.address.country || "N/A"}</p>
          <p>📌 <strong>Coordinates:</strong> {placeData.lat}, {placeData.lng}</p>
          <p>🗺 <strong>Area Covered:</strong> {placeData.data.boundingbox ? `${placeData.data.boundingbox[0]} - ${placeData.data.boundingbox[1]} (Lat), ${placeData.data.boundingbox[2]} - ${placeData.data.boundingbox[3]} (Lon)` : "N/A"}</p>
        </div>
      )}

      {/* ⭐ Importance Score */}
      {placeData.data.importance !== undefined && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">⭐ Importance:</h3>
          <div
            className={`relative w-full ${
              darkMode ? "bg-gray-600" : "bg-gray-300"
            } h-4 rounded-md`}
          >
            <div
              className={`absolute top-0 left-0 h-4 rounded-md ${
                darkMode ? "bg-blue-400" : "bg-blue-500"
              }`}
              style={{ width: `${placeData.data.importance * 100}%` }}
            ></div>
          </div>
          <p className="mt-1">{(placeData.data.importance * 100).toFixed(2)}% relevance</p>
        </div>
      )}

      {/* 🖼 Image Carousel */}
      {placeData.images && placeData.images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">📸 Images:</h3>
          <div className="flex overflow-x-auto space-x-2 mt-2">
            {placeData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Location ${index}`}
                className="w-32 h-24 object-cover rounded-md shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* 🔗 OpenStreetMap Link */}
      <div className="mt-4">
        <a
          href={`http://www.openstreetmap.org/${placeData.data.osm_type}/${placeData.data.osm_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            darkMode ? "text-blue-400" : "text-blue-500"
          } hover:underline`}
        >
          🌐 View on OpenStreetMap
        </a>
      </div>
    </div>
  );
};

export default PopupPanel;
