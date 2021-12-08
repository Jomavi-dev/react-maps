const url = 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'

export const fetchData = async () => {
  try {
    const res = await fetch(url)
    const data = res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}