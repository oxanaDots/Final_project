 export function getDate(timestamp){
  const options ={
  month:'long',
  day: 'numeric',
  year: 'numeric'
  
}
const expireObj = timestamp
const ts = (expireObj?.seconds + expireObj?.nanoseconds/1000000000)*1000;
const expire = new Date(ts).toLocaleString("en-GB", options)
if (timestamp){

    return expire
}



 }

export function getFirebaseTimestamp(data){
const expireObj = data?.expireAt
const ts = (expireObj?.seconds + expireObj?.nanoseconds/1000000000)*1000;
if (data){

    return ts
}
}