import React from 'react';
import '@testing-library/jest-dom'

jest.mock('../firebase.js')

jest.mock('../utilities/fetchBusinesses.js', () => ({
  fetchBusinesses: jest.fn().mockResolvedValue([
    { businessName: 'TestBusiness1',  }
  ]),
}))

jest.mock('../utilities/fetchUpcomingExhibitions.js', ()=>({
   fetchUpcomingExhibitions: jest.fn().mockResolvedValue([
   
  ]),
}))

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
  query:  jest.fn(),
  where:  jest.fn(),
  Timestamp: {fromDate: () => ({}) },
}))


import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchBusinesses } from '../utilities/fetchBusinesses'
import { fetchUpcomingExhibitions } from '../utilities/fetchUpcomingExhibitions';
import Home from '../Home'




describe('Home Screen', () => {

   beforeEach(() => {

    fetchBusinesses.mockResolvedValue([
      { businessName: 'TestBusiness1' }
    ])

 fetchUpcomingExhibitions.mockResolvedValue(
  [{title: 'TestTwo',}, { title: 'TestThree'}]
 )
})


  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Next, previous and current buttons', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(await screen.findByText('TestBusiness1')).toBeInTheDocument()
    expect(await screen.findByText('TestOne')).toBeInTheDocument()

    await waitFor(() =>
    expect(fetchUpcomingExhibitions).toHaveBeenCalled(),
);


    fireEvent.click(screen.getByTestId('next'))
    await expect(screen.getByText('TestTwo')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('prev'))
    expect(await screen.findByText('TestOne')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('current'))
    expect(await screen.findByText('TestOne')).toBeInTheDocument()

  })
})