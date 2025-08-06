jest.mock('../utilities/geoCode.mjs', () => ({
  geoCode: jest.fn(async () => {
    return {lat: 0.0, lng:5.9};
  }),
}));
jest.mock('../utilities/fetchData');
import { fetchData } from "../utilities/fetchData";
import { geoCode } from "../utilities/geoCode.mjs";
describe('Fetches data using Google api', ()=>{
    const fakeData = {results:[{geometry:{location:{lat: 0.0, lng:5.9}}}]}
  
    it ('Successful fetch', async()=>{
      fetchData.mockResolvedValue(fakeData);
      geoCode.mockResolvedValue({ latitude: 0.0, longitude: 5.9 })
    const location = await geoCode('45 Addison road, London');
    expect(location).toEqual({ latitude: 0.0, longitude: 5.9 });
    })

    
     it ('Failed fetch', async()=>{
      fetchData.mockResolvedValue({results:[]});
     const location = await geoCode('45 Addison road, London');

      expect(location).toBeUndefined();    })
})