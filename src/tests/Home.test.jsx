
import '@testing-library/jest-dom'

jest.mock('../firebase.js')

jest.mock('../utilities/fetchBusinesses', () => ({
  fetchBusinesses: jest.fn().mockResolvedValue([
    { businessName: 'TestBusiness1',  }
  ]),
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
import { fetchBusinesses, fetchUpcomingExhibitions } from '../utilities/fetchBusinesses'
import Home from '../Home'
import * as firestore from 'firebase/firestore'

describe('Home Screen', () => {

    const currentEx = {
    title: 'TestOne',
   
  }
  const upcomingExs = [
   
     {
      title: 'TestTwo',
    },
    {
      title: 'TestThree',
     
    },
  ]
   beforeEach(() => {

    fetchBusinesses.mockResolvedValue([
      { businessName: 'TestBusiness1' }
    ])

firestore.getDocs.mockResolvedValue({
  docs: [
    { id: currentEx.docId, data: () => currentEx }
  ]
})


 fetchUpcomingExhibitions.mockResolvedValue(upcomingExs)
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
