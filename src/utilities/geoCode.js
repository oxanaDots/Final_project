
const API_KEY= 'AIzaSyDxe9tazUQv28lXPoUxaqYD5IAVC6TM4Y4'


export async function geoCode(address) {
  try {
 const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;  
 const res = await fetch(url);
 const data = await res.json();

  const  {lat, lng} = data.results[0].geometry.location;
    return {latitude: lat, longitude: lng}
 
  } catch (err) {
    console.error( err);
  }
}