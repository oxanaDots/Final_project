 
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

