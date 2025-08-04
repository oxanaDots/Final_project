

export async function fetchData(link){
      const res = await fetch(link)
      if(!res.ok){
        throw new Error(`Request failed.`);
      
      } else if(res.ok){
          const data = await res.json()
        return data
      }
   
}