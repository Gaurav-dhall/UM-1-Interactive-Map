import React, { useState } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from 'react-leaflet'
import SearchComponent from './components/SearchComponent';
import ClickableMap from './components/ClickableMap';

const App = () => {

  

  //5 marked points on map of famous locations of india 
  const locations = [
    { id: 1, name: "Taj Mahal, Agra", coords: [27.1750, 78.0419], info: "One of the Seven Wonders of the World." },
    { id: 2, name: "India Gate, Delhi", coords: [28.6129, 77.2295], info: "A war memorial for Indian soldiers." },
    { id: 3, name: "Gateway of India, Mumbai", coords: [18.9220, 72.8347], info: "Iconic landmark overlooking the Arabian Sea." },
    { id: 4, name: "Charminar, Hyderabad", coords: [17.3616, 78.4747], info: "Historic monument built in 1591." },
    { id: 5, name: "Amber Fort, Jaipur", coords: [26.9859, 75.8507], info: "A majestic palace with stunning architecture." }
  ];

  //function for current location
  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }
  return (
    <div>
     
      <MapContainer className='h-screen' center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
  <TileLayer
    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <SearchComponent />
  
 {locations.map((place) => (
        <Marker key={place.id} position={place.coords}>
          <Popup>
            <b>{place.name}</b> <br /> {place.info}
          </Popup>
        </Marker>
      ))}
  <LocationMarker />
  <ClickableMap />
</MapContainer>
    </div>
  )
}

export default App