export async function fetchData(){
      const res = await fetch('http://localhost:3000/api/enterprises')
    const data = await res.json()
    return data
}