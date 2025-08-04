import { fetchData } from "./fetchData";
const API_KEY= 'AIzaSyDxe9tazUQv28lXPoUxaqYD5IAVC6TM4Y4'


export async function geoCode(address) {
  try {
 const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;  


 const data = await fetchData(url)

 if (data.results.length > 0){
   const  {lat, lng} = data.results[0].geometry.location;
    return {latitude: lat, longitude: lng}
 } else{
     return 'No data fetched'
 }

  } catch (err) {
    console.error( err);
  }
}