const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { fetchData } from "./fetchData";

export async function geoCode(address) {
  try {
 const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;  


 const data = await fetchData(url)

 if (data.results.length > 0){
   const  {lat, lng} = data.results[0].geometry.location;
    return {latitude: lat, longitude: lng}
 } else{
     return 
 }

  } catch (err) {
    console.error( err);
  }
}