import { useState, useEffect } from 'react'
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl'
import * as parkData from './data/skateboard-parks.json'
import { fetchData } from './api'


const geolocateStyle = {
  top: 0,
  right: 0,
  padding: '10px'
}

const fullscreenControlStyle = {
  top: 36,
  right: 0,
  padding: '10px'
}

const navStyle = {
  top: 72,
  right: 0,
  padding: '10px'
}

const scaleControlStyle = {
  bottom: 36,
  right: 0,
  padding: '10px'
}

const positionOptions = { enableHighAccuracy: true };

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const iconSize = 20

const getMapTheme = (theme) => {
  if (theme === 'dark')
    // dark map
    return 'mapbox://styles/mavixx/cku9q9gfg260818s0btpzohb6'
  return 'mapbox://styles/mavixx/cku9oyv2x24rc18s0v885y5rd'
}

function App() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    // height: '100vh',
    height: '100%',
    // width: '100vw',
    width: '100%',
    zoom: 10,
    bearing: 0,
    pitch: 0
  })
  const [selectedPark, setSelectedPark] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [eqRegions, setEqRegions] = useState([])

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData()
      setEqRegions(fetchedData)
    }
    getData()
  }, [])

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape")
        setSelectedPark(null)
    }

    window.addEventListener("keydown", listener)

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [])


  return (
    <div className="map__container">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={getMapTheme('dark')}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        {eqRegions.features && eqRegions.features.map(eqRegion =>
          <Marker
            key={eqRegion.properties.id}
            latitude={eqRegion.geometry.coordinates[1]}
            longitude={eqRegion.geometry.coordinates[0]}>
            <svg
              height={iconSize}
              viewBox="0 0 24 24"
              style={{
                cursor: 'pointer',
                fill: '#1c4a7c',
                stroke: 'none',
                transform: `translate(${-iconSize / 2}px,${-iconSize}px)`
              }}
              onClick={() => setSelectedRegion(eqRegion)}
            >
              <path d={ICON} />
            </svg>
          </Marker>)}

        {parkData.features.map(park =>
          <Marker
            key={`marker-${park.properties.PARK_ID}`}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}>
            <svg
              height={iconSize}
              viewBox="0 0 24 24"
              style={{
                cursor: 'pointer',
                fill: '#d00',
                stroke: 'none',
                transform: `translate(${-iconSize / 2}px,${-iconSize}px)`
              }}
              onClick={() => setSelectedPark(park)}
            >
              <path d={ICON} />
            </svg>
          </Marker>)}

        {selectedPark && (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => setSelectedPark(null)}
            closeOnClick={false}
          >
            <div className="popup">
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        )}

        {selectedRegion && (
          <Popup
            latitude={selectedRegion.geometry.coordinates[1]}
            longitude={selectedRegion.geometry.coordinates[0]}
            onClose={() => setSelectedRegion(null)}
            closeOnClick={false}
          >
            <div className="popup">
              <p>Lat: {selectedRegion.geometry.coordinates[1]} Lon: {selectedRegion.geometry.coordinates[0]} </p>
              <p>Earth Quake occured here on {new Date(selectedRegion.properties.time).toDateString()} with magnitude of {selectedRegion.properties.mag}</p>
            </div>
          </Popup>
        )}


        <GeolocateControl
          style={geolocateStyle}
          positionOptions={positionOptions}
          trackUserLocation
        // auto
        />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </ReactMapGL>
    </div>
  )
}

export default App;
