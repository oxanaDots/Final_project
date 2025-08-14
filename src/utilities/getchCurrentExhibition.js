import { getDocs, collection, query, Timestamp, where } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchCurrentExhibition(){
    const currentDay = Timestamp.fromDate(new Date());
 const querry = query(
          collection(db, 'exhibitions'),
          where('startsAt', '<=', currentDay),
          where ('status', '==', 'accepted'),
          where('expireAt', '>', currentDay))
          
          const currentExhibitionSnapShot = await getDocs(querry)

          const currentExhibition = currentExhibitionSnapShot.docs.map(doc => ({...doc.data(), docId: doc.id}))
          return currentExhibition
}