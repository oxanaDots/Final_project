
import { createContext, useContext, useState } from 'react';

const ArtistFormContext = createContext();

export const ArtistFormProvider = ({ children }) => {
  const [artistFormData, setArtistFormData] = useState({
    firstName: '',
    lastName:'',
    artGenders: [],
    email: '',
    phoneNumber:'',
    links: [],
    location:'',
    postcode:'',
    password:'',
  });

  return (
    <ArtistFormContext.Provider value={{ artistFormData, setArtistFormData }}>
      {children}
    </ArtistFormContext.Provider>
  );
};

export const useArtistForm = () => useContext(ArtistFormContext);
