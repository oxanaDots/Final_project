jest.mock('../utilities/fetchData');
import { fetchData } from "../utilities/fetchData";
import { geoCode } from "../utilities/geoCode";
describe('Fetches data using Google api', ()=>{
    const fakeData = {results:[{geometry:{location:{lat: 0.0, lng:5.9}}}]}
  
    it ('', async()=>{
      fetchData.mockResolvedValue(fakeData);
    const location = await geoCode('45 Addison road, London');
    expect(location).toEqual({ latitude: 0.0, longitude: 5.9 });
    })
     it ('', async()=>{
      fetchData.mockResolvedValue({results:[]});
     const location = await geoCode('45 Addison road, London');

      expect(location).toBe('No data fetched');
    })
})