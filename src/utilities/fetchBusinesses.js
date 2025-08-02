 
 import { getDocs, collection, query, where} from "firebase/firestore";
 import { db } from "../firebase";

 export async function fetchBusinesses () {
      try {
        const querry = query(
          collection(db, 'businesses'),
          where('currentlyDisplaying', '==', true)
        )
        const snapshot = await getDocs(querry);

        const data = snapshot.docs.map(doc => ({
          businessId: doc.id,
          ...doc.data(),
        }));

        if ( data.length){
         const myMap = new Map()

           data.forEach(item=> myMap.set(item.geoLocation, item))
        } else{

          return undefined
        }

  
      } catch (error) {
        console.error( error);
      }
    };

