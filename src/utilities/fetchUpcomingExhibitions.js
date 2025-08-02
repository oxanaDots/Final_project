 import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
 import { db } from "../firebase";



export async function  fetchUpcomingExhibitions(expireDate){

    try{
         const querry = query(
        collection(db, 'exhibitions'),
        where('startsAt', '>=', expireDate),
        where('status', '==', 'accepted'),
        orderBy('createdAt'))

        const acceptedExhibitionsSnap = await getDocs(querry)
        const acceptedExhibitions = acceptedExhibitionsSnap.docs.map(doc => ({...doc.data(), docId: doc.id}))
     
        if (acceptedExhibitions.length){
            return acceptedExhibitions

        } else{
           return undefined
        }

       

    } catch (err){
  console.error(err)
    }
}