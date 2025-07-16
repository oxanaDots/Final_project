 
 import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
 import { db } from "../firebase";

 export async function fetchBusinesses () {
      try {
        const snapshot = await getDocs(collection(db, "businesses"));
        const data = snapshot.docs.map(doc => ({
          businessId: doc.id,
          ...doc.data(),
        }));

        return data
      } catch (error) {
        console.error( error);
      }
    };

export async function  fetchUpcomingExhibitions(expireDate){

    try{

         const querry = query(
        collection(db, 'exhibitions'),
        where('startsAt', '>=', expireDate),
        where('status', '==', 'accepted'),
        orderBy('createdAt'))

         const acceptedExhibitionsSnap = await getDocs(querry)
        const acceptedExhibitions = acceptedExhibitionsSnap.docs.map(doc => ({...doc.data(), docId: doc.id}))

        return acceptedExhibitions

    } catch (err){
  console.error(err)
    }
}