export async function fetchData(link){
      const res = await fetch(link)
    const data = await res.json()
    return data
}