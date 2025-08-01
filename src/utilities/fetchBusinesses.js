 
 import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
 import { db } from "../firebase";

 export async function fetchBusinesses () {
      try {
        const querry = query(
          collection(db, 'businesses'),
          where('currentlyDisplaying', '==', true)
        )
         const myMap = new Map()
        const snapshot = await getDocs(querry);

        const data = snapshot.docs.map(doc => ({
          businessId: doc.id,
          ...doc.data(),
        }));
            data.forEach(item=> myMap.set(item.geoLocation, item))
             return myMap
    

      } catch (error) {
        console.error( error);
      }
    };

