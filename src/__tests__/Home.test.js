import React from 'react';
import '@testing-library/jest-dom'

jest.mock('../firebase.js')



const mockGeolocation = {
  getCurrentPosition: jest.fn().mockResolvedValue(({coords: 
    {
      latitude: 0.0,
      longitude: 55.7
    }
  }))
};

global.navigator.geolocation = mockGeolocation;

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
  query:  jest.fn(),
  where:  jest.fn(),
  Timestamp: {fromDate: () => ({}) },
}))
jest.mock('../utilities/fetchBusinesses.js', () => ({
  fetchBusinesses: jest.fn().mockResolvedValue([
    { businessName: 'TestBusiness1',  }
  ]),
}))

jest.mock('../utilities/getchCurrentExhibition.js', ()=>({
   fetchCurrentExhibition: jest.fn().mockResolvedValue([

  ]),
}))

jest.mock('../utilities/fetchUpcomingExhibitions.js', ()=>({
   fetchUpcomingExhibitions: jest.fn().mockResolvedValue([
   
  ]),
}))

jest.mock('geolib', ()=>({
   orderByDistance: jest.fn(),
   getDistance: jest.fn(),
   convertDistance: jest.fn()
}))


import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchBusinesses } from '../utilities/fetchBusinesses'
import { fetchUpcomingExhibitions } from '../utilities/fetchUpcomingExhibitions';
import { fetchCurrentExhibition } from '../utilities/getchCurrentExhibition';
import Home from '../Home'
import { orderByDistance, getDistance, convertDistance } from 'geolib'



   describe('Home Screen', () => {

let businesses

   beforeEach(async () => {
    const businessesFakeData =  {
      "0, 0" :{ geoLoc: { lat:0, lng:0 },  businessName: "TestBusiness1", businessId: 'business1' },
      "1, 2" :{ geoLoc: { lat:1, lng:2 },  businessName: "TestBusiness2" , businessId: 'business2'},
   }


      fetchBusinesses.mockResolvedValue(new Map(Object.entries(businessesFakeData)))
      fetchCurrentExhibition.mockResolvedValue([{title: 'TestOne'}])
    
      fetchUpcomingExhibitions.mockResolvedValue([{title: 'TestTwo'}, {title: 'TestThree'}])


      orderByDistance.mockReturnValue([{ latitude: 0.0,  longitude: 55.7},  {latitude: 0.0,longitude: 55.7}])

      getDistance.mockReturnValue(0.5)
      convertDistance.mockReturnValue(0.01)

       businesses = await fetchBusinesses()


})



  it('Next, previous and current buttons move show each exhibition items in correct order', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

  await waitFor(() => {
    expect(fetchUpcomingExhibitions).toHaveBeenCalled();
  });
  
    
    expect(await screen.findByText('TestOne')).toBeInTheDocument()

 
    // expect(fetchUpcomingExhibitions).toHaveBeenCalled()

    fireEvent.click(screen.getByTestId('next'))
     expect(await screen.getByText('TestTwo')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('prev'))
    expect(await screen.findByText('TestOne')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('current'))
    expect(await screen.findByText('TestOne')).toBeInTheDocument()

  })

  
  it ('Businesses should return a map with two entries ', async ()=>{
      expect(businesses).toHaveProperty('size', 2)
  })

  it('', async()=>{

    fetchBusinesses.mockResolvedValue(new Map())
    const emptyBusinesses = await fetchBusinesses()
    expect(emptyBusinesses).toHaveProperty('size', 0)

  })
})