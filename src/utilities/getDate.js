 export function getDate(date){



  const options ={
  month:'long',
  day: 'numeric',
  year:'numeric'
}
const expireObj = date.expireAt
const ts = (expireObj?.seconds + expireObj?.nanoseconds/1000000000)*1000
const expire = new Date(ts).toLocaleString("en-GB", options)
return expire
 }

