

import { fetchData } from "../utilities/fetchData";


describe('', ()=>{
    
    it('fetches data from an API endpoint', async () => {
      const mockData = { id: 1, name: 'Example' };

//   overwrite globa fetch function and return mocked data
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({

    json: async () => mockData,
    status: 200,
    ok: true

  });


  const data = await fetchData('/example');

  expect(data).toEqual(mockData);

  expect(fetch).toHaveBeenCalledWith('/example');

});


  it('fails data from an API endpoint', async () => {


//   overwrite globa fetch function and return mocked data
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 500 });


  await expect(fetchData('/wrongpath')).rejects.toThrow('Request failed.');

  expect(fetch).toHaveBeenCalledWith('/wrongpath');

});
})

// code taken from https://www.browserstack.com/guide/jest-mock-fetch-requests