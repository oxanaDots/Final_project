export async function fetchData(){
      const res = await fetch('/api/enterprises')
    const data = await res.json()
    return data
}